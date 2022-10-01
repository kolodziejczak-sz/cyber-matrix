import { getScope } from './getScope';
import { getSymbols } from './getSymbols';
import { getSequences } from './getSequences';
import { findCell } from './findCell';
import { effect } from '@/utils/effect';
import './Matrix.css';

// const state = {
//   mode: 'row | column',
//   selectionIndex: 0,
//   isGameOver: false,
//   buffor: [],
// }

export const Matrix = () => {
  const { array, width } = getSymbols(5);
  const abortController = new AbortController();
  const signal = abortController.signal;

  const buttons = array.map((symbol, index) => {
    const column = (index % width).toString();
    const row = Math.floor(index / width).toString();

    return (
      <button
        class="matrix__button"
        data-column={column}
        data-row={row}
        data-symbol={symbol}
      >
        {symbol}
      </button>
    );
  });


  const matrixHandler = (el: HTMLElement) => {
    const scope = getScope(el);

    scope.moveTo({ index: 0, direction: 'row' });

    getSequences(width, scope.getCurrentScope(), buttons);

    const handleClick = effect((event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'BUTTON') {
        return;
      }

      const { row, column } = target.dataset;
      const { direction, index } = scope.getCurrentScope();
      const cellToSelect = buttons.find(findCell, {
        row: Number(row),
        column: Number(column),
        [direction]: index
      });
  
      if (cellToSelect.hasAttribute('data-disabled')) {
        return;
      }
  
      cellToSelect.classList.add('matrix__button--selected');
      cellToSelect.setAttribute('data-disabled', 'true');
      cellToSelect.textContent = '[ ]';

      const nextDirection = direction === 'row' ? 'column' : 'row';
      const nextIndex = nextDirection === 'row' ? Number(row) : Number(column);

      scope.moveTo({ direction: nextDirection, index: nextIndex });

      handleMouseOver(event);
    });

    const handleMouseOver = effect((event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'BUTTON') {
        return;
      }

      const className = 'matrix__button--highlight';
      const { row, column } = target.dataset;
      const { index, direction } = scope.getCurrentScope();
      const cell = buttons.find(findCell, {
        row: Number(row),
        column: Number(column),
        [direction]: index
      });

      cell.classList.add(className);

      return () => {
        cell.classList.remove(className);
      };
    });

    el.addEventListener('mouseover', handleMouseOver, { signal });
    el.addEventListener('click', handleClick, { signal });

    return () => {
      abortController.abort();
    };
  };

  return (
    <div class="matrix">
      <header class="matrix__header">Code Matrix</header>
      <div
        class="matrix__buttons"
        style={`--matrix-size:${width}`}
        ref={matrixHandler}
      >
        {buttons}
      </div>
    </div>
  );
};
