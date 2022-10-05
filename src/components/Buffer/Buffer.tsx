import { getContext } from '@/game/context';
import { classListEffect } from '@/utils/classListEffect';
import { defer } from '@/utils/defer';
import { effect } from '@/utils/effect';

import './Buffer.css';

type Props = {
  className: string;
}

export const Buffer = ({ className }: Props) => {
  const { eventBus, settings } = getContext();
  const { bufferSettings: { length } } = settings;

  const bufferCells = Array.from({ length }).map(() => {
    return <span class="buffer__cell" />
  });

  const view = (
    <div class={`${className} buffer`}>
      <div>Buffer</div>
      <div class="buffer__cells">
        {bufferCells}
      </div>
    </div>
  );

  const selectedClass = 'buffer__cell--selected';
  const highlightClass = 'buffer__cell--highlight';
  const cursorClass = 'buffer__cell--cursor';
  let bufferCursor = -1;

  /**
   * Push the cursor to the next cell.
   */
  const pushBufferCursor = effect(() => {
    const nextCursor = bufferCursor + 1;
    const shouldEndGame = nextCursor === length;

    if (shouldEndGame) {
      // Defer the game-end event for animations.
      return defer(() => {
        eventBus.dispatchEvent(new CustomEvent('game-end', { detail: 'buffer' }));
      });
    }

    bufferCursor = nextCursor;
    const cell = bufferCells[bufferCursor];

    return classListEffect(cursorClass, cell);
  });


  /**
   * A cell in the matrix has been selected. Populate the buffer with the selected cell symbol and move the cursor forward.
   */
  const handleMatrixCellSelect = (event: CustomEvent) => {
    const { symbol } = event.detail;
    const cellToPopulate = bufferCells[bufferCursor];

    cellToPopulate.classList.add(selectedClass);
    cellToPopulate.textContent = symbol;
    pushBufferCursor();
  };

  /**
   * Highlight a sequence symbol that is being currently highlighted in the matrix.
   */
  const handleMatrixCellHightlight = effect((event: CustomEvent) => {
    const { symbol, disabled } = event.detail || {};
    if (!symbol || disabled) {
      return;
    }

    const cellToPopulate = bufferCells[bufferCursor];
    cellToPopulate.textContent = symbol;

    const removeClassName = classListEffect(highlightClass, cellToPopulate);

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

  /** Game ended. Send the status */
  eventBus.addEventListener('game-end', () => {
    abortController.abort();
  }, { once: true });

  return view;
}