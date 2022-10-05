import { getContext } from '@/game/context';
import { findCell } from '@/game/findCell';
import { classListEffect } from '@/utils/classListEffect';
import { effect } from '@/utils/effect';

import './Sequences.css';

type Props = {
  className: string;
}

export const Sequences = ({ className }: Props) => {
  const { sequences, eventBus, settings } = getContext();
  const bufferLength = settings.bufferSettings.length;
  const longestSequence = Math.max(
    bufferLength, ...sequences.map(({ length }) => length)
  );

  const cells: HTMLElement[] = [];
  const rows = sequences.map(({ symbols, points }, rowIndex) => (
    <li class="sequences__item">
      {symbols.map((symbol, columnIndex) => {
        const cell = (
          <button
            class="sequences__cell"
            data-row={rowIndex.toString()}
            data-column={columnIndex.toString()}
            data-symbol={symbol}
          >
            {symbol}
          </button>
        );

        cells.push(cell);

        return cell;
      })}
      <div class="sequences__details">
        <span class="sequences__name">DATAMINE_V{rowIndex}</span>
        <span class="sequences__value">
          {points}points
        </span>
      </div>
    </li>
  ));

  const list = (
    <ul
      class="sequences__list"
      style={`--sequences-size:${longestSequence};`}
    >
      {rows}
    </ul>
  );

  const view = (
    <div class={`${className} sequences card`}>
      <div class="card__header card__header--secondary">
        Sequence required to upload
      </div>
      {list}
    </div>
  );

  const selectedClass = 'sequences__cell--selected';
  const highlightClass = 'sequences__cell--highlight';
  const cursorClass = 'sequences__cell--cursor';
  const succeedClass = 'sequences__item--success';
  const failedClass = 'sequences__item--fail';
  const selectedMatrixSymbols = [];
  const sequencesStatus = sequences.map(() => undefined);
  let sequenceCursor = -1;

  /**
   * Push the vertical scope to the next column.
   */
  const pushScopeCursor = effect(() => {
    const nextCursor = Math.min(bufferLength, sequenceCursor + 1);
    sequenceCursor = nextCursor;

    const cell = cells.find(findCell, { column: nextCursor });

    if (cell) {
      return classListEffect(cursorClass, cell);
    }
  });

  /**
   * Move given row to the next column.
   */
  const pushRow = (rowIndex: number) => {
    const rowCells = cells.filter(findCell, { row: rowIndex });

    rowCells.forEach(cell => {
      const nextColumn = (Number(cell.dataset.column) + 1).toString()
      cell.setAttribute('data-column', nextColumn);
    });

    const emptyCell = (
      <button
        data-row={rowIndex.toString()}
        data-column="0"
        data-disabled="true"
      />
    );

    rows[rowIndex].prepend(emptyCell);
    cells.push(emptyCell);
  };

  /**
   * Request the matrix to highlight a symbol currently selected by a user.
   */
  const handleMouseOver = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const symbol = target.dataset.symbol;
    const symbolSearchEvent = new CustomEvent('symbol-search', { detail: symbol });

    eventBus.dispatchEvent(symbolSearchEvent);
  };

  /**
   * Highlight a sequence symbol that is being currently highlighted in the matrix.
   */
  const handleMatrixCellHightlight = effect((event: CustomEvent) => {
    const { symbol, disabled } = event.detail || {};
    if (!symbol || disabled) return;

    const symbolsToHighlight = cells.filter(findCell, { symbol, column: sequenceCursor });

    return classListEffect(highlightClass, symbolsToHighlight);
  });

  /**
   * Check if given sequence succeed.
   */
  const isRowSucceed = (rowIndex: number) => {
    const sequenceText = sequences[rowIndex].symbols.join('');
    const bufferText = selectedMatrixSymbols.join('');

    return bufferText.includes(sequenceText);
  };

  /**
   * Finish sequence and render feedback.
   */
  const finishSequence = (rowIndex: number, result: boolean) => {
    sequencesStatus[rowIndex] = result;

    const sequence = rows[rowIndex];
    sequence.classList.add(result ? succeedClass : failedClass);
    sequence.prepend(
      <div class='sequences__status'>
        {result ? 'Success' : 'Failed'}
      </div>
    );
  };

  /**
   * A cell in the matrix has been selected.
   * Check if any sequence failed or succeed,
   * highlight a selected symbol in sequences,
   * move the cursor and rows if possible.
   */
  const handleMatrixCellSelect = (event: CustomEvent) => {
    const { symbol } = event.detail;
    selectedMatrixSymbols.push(symbol);

    const cursorCells = cells.filter(findCell, { column: sequenceCursor });

    cursorCells.forEach((cell, rowIndex) => {
      const sequenceStatus = sequencesStatus[rowIndex];
      const isSequenceAlreadyDone = sequenceStatus !== undefined;
      if (isSequenceAlreadyDone) return;

      const prevCell = cells.find(findCell, { row: rowIndex, column: sequenceCursor - 1 });
      const isPrevCellDisabled = Boolean(prevCell && prevCell.dataset.disabled);
      const isPrevCellSelected = Boolean(prevCell && prevCell.classList.contains(selectedClass))
      const isSelectable = !prevCell || isPrevCellDisabled || isPrevCellSelected;

      // f3 d0 - sequence
      // f3 f3 - sequence
      if (isSelectable && cell.dataset.symbol === symbol) {
        cell.classList.add(selectedClass);

        const hasSequenceSucceed = isRowSucceed(rowIndex);
        if (hasSequenceSucceed) {
          finishSequence(rowIndex, true);
        }
      } else {
        const rowCells = cells.filter(findCell, { row: rowIndex });
        const isMovable = prevCell?.dataset.symbol === cell.dataset.symbol || !isPrevCellSelected;
        if (isMovable && (bufferLength > rowCells.length)) {
          pushRow(rowIndex);
        } else {
          // TODO: Failed?
          finishSequence(rowIndex, false);
        }
      }
    });

    pushScopeCursor();
  };

  pushScopeCursor();
  finishSequence(0, false)

  const abortController = new AbortController();
  const signal = abortController.signal;

  list.addEventListener('mouseover', handleMouseOver, { signal });
  eventBus.addEventListener('cell-highlight', handleMatrixCellHightlight, { signal });
  eventBus.addEventListener('cell-select', handleMatrixCellSelect, { signal });
  eventBus.addEventListener('game-end', () => {
    abortController.abort();
  },  { once: true });

  return view;
};