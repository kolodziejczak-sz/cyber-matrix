import { classListEffect } from '@/utils/classListEffect';
import { defer } from '@/utils/defer';
import { effect } from '@/utils/effect';
import { getContext } from '@/game/context';
import { findCell } from '@/game/findCell';

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

  let cells: HTMLElement[] = [];
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

  const cursor = (
    <div class="sequences__cursor" style="--sequences-cursor:1;">
      <div />
    </div>
  );

  const list = (
    <ul
      class="sequences__list"
      style={`--sequences-size:${longestSequence};`}
    >
      {rows}
      {cursor}
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
  const succeedClass = 'sequences__item--success';
  const failedClass = 'sequences__item--fail';
  const selectedMatrixSymbols = [];
  const sequencesStatus = sequences.map(() => undefined);
  let cursorIndex = 0;

  /**
   * Push the vertical cursor to the next column.
   */
  const pushCursor = () => {
    const nextCursor = Math.min(bufferLength, cursorIndex + 1);
    const cssGridIndex = Math.min(bufferLength, nextCursor + 1).toString();

    cursorIndex = nextCursor;
    cursor.style.setProperty('--sequences-cursor', cssGridIndex);
  };

  /**
   * Move given row to the next column.
   */
  const pushRow = (rowIndex: number, maxDistance: number): boolean => {
    const rowCells = cells.filter(findCell, { row: rowIndex });
    const bufferEndIndex = bufferLength - 1;
    const lastRowCell = rowCells[rowCells.length - 1];
    const columnEndIndex = Number(lastRowCell.dataset.column) + maxDistance;
    const distance = (columnEndIndex > bufferEndIndex) ? columnEndIndex - bufferEndIndex : maxDistance;

    if (distance !== maxDistance) {
      return false;
    }

    rowCells.forEach(cell => {
      const nextColumn = (Number(cell.dataset.column) + distance).toString()
      cell.setAttribute('data-column', nextColumn);
    });

    for (let i = 0; i < distance; i++) {
      const emptyCell = (
        <button
          data-row={rowIndex.toString()}
          data-column="0"
          data-disabled="true"
        />
      );
  
      rows[rowIndex].prepend(emptyCell);
    }

    return true;
  };

  /**
   * Finish sequence and render feedback.
   * Remove no longer needed cells and check if the game should end.
   */
  const finishSequence = (rowIndex: number, result: boolean) => {
    sequencesStatus[rowIndex] = result;

    const rowCells = cells.filter(findCell, { row: rowIndex });
    rowCells.forEach(c => c.remove());
    cells = cells.filter(c => !rowCells.includes(c));

    const sequence = rows[rowIndex];
    sequence.classList.add(result ? succeedClass : failedClass);
    sequence.prepend(
      <div class='sequences__status'>
        {result ? 'Success' : 'Failed'}
      </div>
    );

    const isGameEnd = sequencesStatus.every(status => status !== undefined);
    if (isGameEnd) {
      // Defer the game-end event for the buffer animations.
      defer(() => {
        eventBus.dispatchEvent(new CustomEvent('game-end', { detail: 'sequences' }));
      });
    }
  };

  /**
   * Request the matrix to highlight a symbol currently selected by a user.
   * Emit an event to let the matrix know what symbol is being searched.
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

    const symbolsToHighlight = cells.filter(findCell, { symbol, column: cursorIndex });

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
   * A cell in the matrix has been selected.
   * Check if any sequence failed or succeed,
   * highlight a selected symbol in sequences,
   * move the cursor and rows if possible.
   */
  const handleMatrixCellSelect = (event: CustomEvent) => {
    const { symbol: bufferLastSymbol } = event.detail;
    selectedMatrixSymbols.push(bufferLastSymbol);

    const cursorCells = cells.filter(findCell, { column: cursorIndex });

    cursorCells.forEach((cursorCell) => {
      const rowIndex = Number(cursorCell.dataset.row);
      const hasSequenceSucceed = isRowSucceed(rowIndex);
      if (hasSequenceSucceed) {
        return finishSequence(rowIndex, true);
      }

      const rowCells = cells.filter(findCell, { row: rowIndex });
      const prevCell = cells.find(findCell, { row: rowIndex, column: cursorIndex - 1 });
      const isPrevCellExists = Boolean(prevCell);
      const isPrevCellSelected = Boolean(isPrevCellExists && prevCell.classList.contains(selectedClass))
      const isSelectable = !isPrevCellExists || isPrevCellSelected;

      if (isSelectable && cursorCell.dataset.symbol === bufferLastSymbol) {
        cursorCell.classList.add(selectedClass);
      } else {
        rowCells.forEach(c => c.classList.remove(selectedClass));

        const optionsLeftCount = bufferLength - selectedMatrixSymbols.length;
        const sequenceLength = sequences[rowIndex].symbols.length
        const cursorOverSequenceIndex = rowCells.indexOf(cursorCell);
        const hasSequenceFailed = optionsLeftCount < (sequenceLength - cursorOverSequenceIndex);

        if (hasSequenceFailed) {
          return finishSequence(rowIndex, false);
        }

        const rowLength = rowCells.length;
        const isMovable = (bufferLength > rowLength);
        if (isMovable) {
          const pushCount = cursorOverSequenceIndex + 1;
          const pushSucceed = pushRow(rowIndex, pushCount);
          if (!pushSucceed) {
            finishSequence(rowIndex, false)
          }
        } else {
          console.log('the row')
        }
      }
    });

    pushCursor();
  };

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