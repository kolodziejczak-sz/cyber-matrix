import { getContext } from '@/game/context';
import { classListEffect } from '@/utils/classListEffect';
import { defer } from '@/utils/defer';
import { effect } from '@/utils/effect';

import './Buffer.css';

type Props = {
  className: string;
}

export const Buffer = ({ className }: Props) => {
  const selectedClass = 'buffer__cell--selected';
  const highlightClass = 'buffer__cell--highlight';
  const cursorClass = 'buffer__cell--cursor';

  const { eventBus, settings } = getContext();
  const { bufferSettings: { length } } = settings;
  let bufferCursor = -1;

  const bufferCells = Array.from({ length }).map(() => {
    return <span class="buffer__cell" />
  });

  const pushBufferCursor = effect(() => {
    const nextCursor = bufferCursor + 1;

    /** Game ends. Defer the game-end event for animations. */
    if (nextCursor === length) {
      return defer(() => {
        eventBus.dispatchEvent(new CustomEvent('game-end', { detail: 'buffer' }));
      });
    }

    bufferCursor = nextCursor;
    const cell = bufferCells[bufferCursor];

    return classListEffect(cursorClass, cell);
  });

  const handleBuffer = () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

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

    eventBus.addEventListener('cell-highlight', handleMatrixCellHightlight, { signal });
    eventBus.addEventListener('cell-select', handleMatrixCellSelect, { signal });

    /** Game ended. Send the status */
    eventBus.addEventListener('game-end', () => {
      abortController.abort();

    }, { signal, once: true });

    return () => {
      abortController.abort();
    }
  }

  pushBufferCursor();

  return (
    <div 
      class={`${className} buffer`}
      ref={handleBuffer}
    >
      <div>Buffer</div>
      <div class="buffer__cells">
        {bufferCells}
      </div>
    </div>
  );
}