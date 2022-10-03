import { effect } from '@/utils/effect';
import { getNextDirection } from '@/game/getNextDirection';
import { getContext } from '@/game/context';
import { createScope } from '@/components/Matrix/scope';
import { findCell } from '@/game/findCell';

import './Matrix.css';

type Props = {
  className: string;
}

export const Matrix = ({ className }: Props) => {
  const { eventBus, matrix, settings: { scopeSettings } } = getContext();
  const { rowLength, symbols } = matrix;

  const cells = symbols.map((symbol, index) => {
    const column = (index % rowLength).toString();
    const row = Math.floor(index / rowLength).toString();

    return (
      <button
        class="matrix__cell"
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
      const { direction, index } = scope.getValue();
      const { row, column } = (event.target as HTMLElement).dataset;

      return cells.find(findCell, {
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
  
      highlightedCell.classList.add('matrix__cell--selected');
      highlightedCell.setAttribute('data-disabled', 'true');
      highlightedCell.textContent = '[ ]';

      const nextDirection = getNextDirection(direction);
      const nextIndex = nextDirection === 'row' ? Number(row) : Number(column);

      scope.moveTo({ direction: nextDirection, index: nextIndex });

      const matrixSelectedEvent = new CustomEvent('matrix-selected', { detail: highlightedCell.dataset });
      eventBus.dispatchEvent(matrixSelectedEvent);

      handleMouseOver(event);
    };

    const handleMouseOver = effect((event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'BUTTON') {
        return;
      }

      const className = 'matrix__cell--highlight';
      const cellToHighlight = getCellToHighlight(event);
      cellToHighlight.classList.add(className);

      const matrixHighlightEvent = new CustomEvent('matrix-highlight', { detail: cellToHighlight.dataset });
      eventBus.dispatchEvent(matrixHighlightEvent);

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
    <div class={`matrix card ${className}`}>
      <header class="card__header">Code Matrix</header>
      <div
        class="matrix__cells"
        style={`--matrix-size:${rowLength}`}
        ref={matrixHandler}
      >
        {cells}
      </div>
    </div>
  );
};
