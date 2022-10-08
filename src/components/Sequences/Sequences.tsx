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
    <div class={`${className} sequences cut-border`}>
      <div class="sequences__header">
        Sequence required to upload
      </div>
      {list}
    </div>
  );

  const selectedClass = 'sequences__cell--selected';
  const highlightClass = 'sequences__cell--highlight';
  const succeedClass = 'sequences__item--success';
  const failedClass = 'sequences__item--fail';
  const sequencesStatus = sequences.map(() => undefined);
  const selectedMatrixSymbols = [];
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
  const pushRow = (rowIndex: number, distance: number) => {
    const rowCells = cells.filter(findCell, { row: rowIndex });

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
   * A cell in the matrix has been selected.
   * Check if any sequence failed or succeed,
   * highlight a selected symbol in sequences,
   * move the cursor and rows if possible.
   */
  const handleBufferUpdate = (event: CustomEvent) => {
    const bufferLastSymbol = event.detail;
    selectedMatrixSymbols.push(bufferLastSymbol);

    const cursorCells = cells.filter(findCell, { column: cursorIndex });

    cursorCells.forEach((cursorCell) => {
      const rowIndex = Number(cursorCell.dataset.row);
      const sequenceSymbols = sequences[rowIndex].symbols;

      const sequenceText = sequenceSymbols.join('');
      const bufferText = selectedMatrixSymbols.join('');
      const hasRowSucceed = bufferText.includes(sequenceText);

      if (hasRowSucceed) {
        return finishSequence(rowIndex, true);
      }

      const rowCells = cells.filter(findCell, { row: rowIndex });
      const cursorOverSequenceIndex = rowCells.indexOf(cursorCell);
      const prevCells = rowCells.slice(0, cursorOverSequenceIndex);

      const [lastPrevCell] = prevCells.slice(-1); 
      const isSelectable = !lastPrevCell ? true : lastPrevCell.classList.contains(selectedClass);
      const isRightSymbol = cursorCell.dataset.symbol === bufferLastSymbol;

      if (isSelectable && isRightSymbol) {
        cursorCell.classList.add(selectedClass);
      } else {
        const optionsLeftCount = bufferLength - selectedMatrixSymbols.length;
        const sequenceLength = sequenceSymbols.length;
        const hasNoSpaceLeft = optionsLeftCount < (sequenceLength - cursorOverSequenceIndex);

        if (hasNoSpaceLeft) {
          return finishSequence(rowIndex, false);
        }

        let pushCount = 1;

        prevCells.forEach(prevCell => {
          if (prevCell.dataset.symbol !== bufferLastSymbol) {
            prevCell.classList.remove(selectedClass);
            pushCount += 1;
          }
        });

        const lastRowCell = rowCells[rowCells.length - 1];
        const nextColumnEndIndex = Number(lastRowCell.dataset.column) + pushCount;
        const bufferEndIndex = bufferLength - 1;

        if (nextColumnEndIndex > bufferEndIndex) {
          return finishSequence(rowIndex, false)
        }

        pushRow(rowIndex, pushCount);
      }
    });

    pushCursor();
  };

  const abortController = new AbortController();
  const signal = abortController.signal;

  list.addEventListener('mouseover', handleMouseOver, { signal });
  eventBus.addEventListener('cell-highlight', handleMatrixCellHightlight, { signal });
  eventBus.addEventListener('buffer-update', handleBufferUpdate, { signal });
  eventBus.addEventListener('game-end', () => {
    abortController.abort();
  },  { once: true });

  return view;
};