import { effect } from '@/utils/effect';
import { getNextDirection } from '@/game/getNextDirection';
import { getContext } from '@/game/context';
import { createScope } from '@/components/Matrix/scope';
import { findCell } from '@/components/Matrix/findCell';

import './Matrix.css';

type Props = {
  className: string;
}

export const Matrix = ({ className }: Props) => {
  const context = getContext();
  const { matrix, settings: { scopeSettings } } = context;
  const { rowLength, symbols } = matrix;

  const buttons = symbols.map((symbol, index) => {
    const column = (index % rowLength).toString();
    const row = Math.floor(index / rowLength).toString();

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
    const scope = createScope(el, scopeSettings);

    const getCellToHighlight = (event: MouseEvent) => {
      const cell = event.target as HTMLButtonElement;
      const { row, column } = cell.dataset;
      const { direction, index } = scope.getValue();

      return buttons.find(findCell, {
        row: Number(row),
        column: Number(column),
        [direction]: index,
      });
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'BUTTON') {
        return;
      }

      const { direction } = scope.getValue();
      const { row, column } = target.dataset;
      const highlightedCell = getCellToHighlight(event);
  
      if (highlightedCell.hasAttribute('data-disabled')) {
        return;
      }
  
      highlightedCell.classList.add('matrix__button--selected');
      highlightedCell.setAttribute('data-disabled', 'true');
      highlightedCell.textContent = '[ ]';

      const nextDirection = getNextDirection(direction);
      const nextIndex = nextDirection === 'row' ? Number(row) : Number(column);

      scope.moveTo({ direction: nextDirection, index: nextIndex });

      handleMouseOver(event);
    };

    const handleMouseOver = effect((event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'BUTTON') {
        return;
      }

      const className = 'matrix__button--highlight';
      const cellToHighlight = getCellToHighlight(event);
      cellToHighlight.classList.add(className);

      return () => {
        cellToHighlight.classList.remove(className);
      };
    });

    const abortController = new AbortController();
    const signal = abortController.signal;

    el.addEventListener('mouseover', handleMouseOver, { signal });
    el.addEventListener('click', handleClick, { signal });

    return () => {
      abortController.abort();
    };
  };

  return (
    <div class={`matrix ${className}`}>
      <header class="matrix__header">Code Matrix</header>
      <div
        class="matrix__buttons"
        style={`--matrix-size:${rowLength}`}
        ref={matrixHandler}
      >
        {buttons}
      </div>
    </div>
  );
};
