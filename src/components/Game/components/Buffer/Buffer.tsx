import { getContext } from '@/components/Game/context';
import { classNameEffect } from '@/components/Game/utils/classNameEffect';
import { defer } from '@/components/Game/utils/defer';
import { effect } from '@/components/Game/utils/effect';
import { CellData } from '@/components/Game/types';

import './Buffer.css';


export const Buffer = () => {
  const { eventBus, settings } = getContext();
  const { bufferSettings: { length } } = settings;

  const bufferCells = Array.from({ length }).map(() => {
    return <span class="buffer__cell" />
  });

  const view = (
    <div class="buffer">
      <div>Buffer</div>
      <div class="buffer__cells">
        {bufferCells}
      </div>
    </div>
  );

  const cursorClass = 'buffer__cell--cursor';
  const highlightClass = 'buffer__cell--highlight';
  const selectedClass = 'buffer__cell--selected';
  let bufferCursor = -1;

  /**
   * Push the cursor to the next cell.
   */
  const pushBufferCursor = effect(() => {
    const nextCursor = bufferCursor + 1;
    const shouldEndGame = nextCursor === length;

    if (shouldEndGame) {
      // Defer the game-end event for the buffer animations.
      return defer(() => {
        eventBus.dispatchEvent(new CustomEvent('game-end', { detail: 'buffer' }));
      });
    }

    bufferCursor = nextCursor;
    const cell = bufferCells[bufferCursor];

    return classNameEffect(cursorClass, cell);
  });

  /**
   * Removes the cursor animation.
   */
  const removeCursor = () => {
    const cell = bufferCells[bufferCursor];
    if (!cell) return;

    cell.classList.remove(cursorClass);
  };


  /**
   * A cell in the matrix has been selected. Populate the buffer with the selected cell symbol and move the cursor forward.
   */
  const handleMatrixCellSelect = (event: CustomEvent<CellData | null>) => {
    const { symbol } = event.detail;
    const cellToPopulate = bufferCells[bufferCursor];

    cellToPopulate.classList.add(selectedClass);
    cellToPopulate.textContent = symbol;
    eventBus.dispatchEvent(new CustomEvent('buffer-update', { detail: symbol }));

    pushBufferCursor();
  };

  /**
   * Highlight a sequence symbol that is being currently highlighted in the matrix.
   */
  const handleMatrixCellHightlight = effect((event: CustomEvent<CellData | null>) => {
    const { symbol, disabled } = event.detail || {};
    if (!symbol || disabled) {
      return;
    }

    const cellToPopulate = bufferCells[bufferCursor];
    cellToPopulate.textContent = symbol;

    const removeClassName = classNameEffect(highlightClass, cellToPopulate);

    return () => {
      removeClassName();
      if (!cellToPopulate.classList.contains(selectedClass)) {
        cellToPopulate.textContent = '';
      }
    };
  });

  pushBufferCursor();

  const abortController = new AbortController();
  const signal = abortController.signal;

  eventBus.addEventListener('cell-highlight', handleMatrixCellHightlight, { signal });
  eventBus.addEventListener('cell-select', handleMatrixCellSelect, { signal });
  eventBus.addEventListener('game-end', () => {
    removeCursor();
    abortController.abort()
  }, { once: true });

  return view;
}