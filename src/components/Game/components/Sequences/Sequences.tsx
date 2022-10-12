import { classNameEffect } from '@/components/Game/utils/classNameEffect';
import { defer } from '@/components/Game/utils/defer';
import { effect } from '@/components/Game/utils/effect';
import { findCell } from '@/components/Game/utils/findCell';
import { CellData } from '@/components/Game/types';
import { getContext } from '@/components/Game/context';

import './Sequences.css';

type Props = {
  className: string;
}

export const Sequences = ({ className }: Props) => {
  const { sequences, eventBus, settings } = getContext();
  const { bufferSettings, controllerSettings } = settings;
  const bufferLength = bufferSettings.length;
  const longestSequence = Math.max(
    bufferLength, ...sequences.map(({ length }) => length)
  );

  let cells: HTMLElement[] = [];
  const rows = sequences.map(({ points, name, symbols }, rowIndex) => (
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
        <span class="sequences__name">{name}</span>
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
    <div class={`${className} sequences cut-top-corner`}>
      <div class="sequences__header">
        Sequence required to upload
      </div>
      {list}
    </div>
  );

  const highlightClass = 'sequences__cell--highlight';
  const selectedClass = 'sequences__cell--selected';
  const succeedClass = 'sequences__item--success';
  const failedClass = 'sequences__item--fail';
  const sequencesStatus = sequences.map(() => null);
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
    sequence.classList.add(result ? succeedClass : failedClass, 'cut-bottom-corner');
    sequence.prepend(
      <div class='sequences__status'>
        {result ? 'Success' : 'Failed'}
      </div>
    );

    const isGameEnd = sequencesStatus.every(status => status !== null);
    if (isGameEnd) {
      // Defer the game-end event for the buffer animations.
      defer(() => {
        eventBus.dispatchEvent(new CustomEvent('game-end', { detail: 'sequences' }));
      });
    }
  };

  /**
   * Request the matrix to highlight a symbol currently selected by a user.
   * Emit an event to let the matrix know what symbol is being queried.
   */
  const handleSymbolQuery = (event: Event) => {
    const target = event.target as HTMLElement;
    const symbol = event.type.endsWith('out')  ? null : target.dataset.symbol;
    const symbolSearchEvent = new CustomEvent('symbol-search', { detail: symbol });

    eventBus.dispatchEvent(symbolSearchEvent);
  };

  /**
   * Highlight a sequence symbol that is being currently highlighted in the matrix.
   */
  const handleMatrixCellHightlight = effect((event: CustomEvent<CellData | null>) => {
    const { symbol, disabled } = event.detail || {};
    if (!symbol || disabled) return;

    const symbolsToHighlight = cells.filter(findCell, { symbol, column: cursorIndex });

    return classNameEffect(highlightClass, symbolsToHighlight);
  });

  /**
   * A cell in the matrix has been selected.
   * Check if any sequence failed or succeed,
   * highlight a selected symbol in sequences,
   * move the cursor and rows if possible.
   */
  const handleBufferUpdate = (event: CustomEvent<string>) => {
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

        /** TODO: check if any next symbol of the current sequence is within the matrix scope  */

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

  if (controllerSettings === 'touch') {
    list.addEventListener('focusin', handleSymbolQuery, { signal });
    list.addEventListener('focusout', handleSymbolQuery, { signal });
  } else {
    list.addEventListener('mouseover', handleSymbolQuery, { signal });
    list.addEventListener('mouseout', handleSymbolQuery, { signal });
  }

  eventBus.addEventListener('cell-highlight', handleMatrixCellHightlight, { signal });
  eventBus.addEventListener('buffer-update', handleBufferUpdate, { signal });
  eventBus.addEventListener('game-end', () => {
    abortController.abort();

    defer(() => {
      eventBus.dispatchEvent(
        new CustomEvent('sequences-data', { detail: sequencesStatus })
      );
    });
  },  { once: true });

  return view;
};