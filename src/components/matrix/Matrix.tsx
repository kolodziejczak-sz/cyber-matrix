import { effect } from '@/utils/effect';
import { classListEffect } from '@/utils/classListEffect';
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

  const cellsContainer = (
    <div
      class="matrix__cells"
      style={`--matrix-size:${rowLength}`}
    >
      {cells}
    </div>
  );

  const view = (
    <div class={`${className} matrix card`}>
      <header class="card__header">Code Matrix</header>
      {cellsContainer}
    </div>
  );

  const selectedClass = 'matrix__cell--selected';
  const highlightClass = 'matrix__cell--highlight';
  const queryClass = 'matrix__cell--query';
  const scope = createScope(cellsContainer, scopeSettings);

  /**
   * Find a cell to highlight within the scope.
   */
  const getCellToHighlight = (event: MouseEvent) => {
    const { direction, index } = scope.getValue();
    const { row, column } = (event.target as HTMLElement).dataset;

    if (!row && !column) return;

    return cells.find(findCell, {
      row: Number(row),
      column: Number(column),
      [direction]: index,
    });
  };

  /**
   * A user clicked a symbol in the matrix. Select a highlighted cell.
   */
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

    highlightedCell.classList.add(selectedClass);
    highlightedCell.setAttribute('data-disabled', 'true');
    highlightedCell.textContent = '[ ]';

    const nextDirection = getNextDirection(direction);
    const nextIndex = nextDirection === 'row' ? Number(row) : Number(column);

    scope.moveTo({ direction: nextDirection, index: nextIndex });

    const matrixSelectedEvent = new CustomEvent('cell-select', { detail: highlightedCell.dataset });
    eventBus.dispatchEvent(matrixSelectedEvent);

    handleMouseOver(event);
  };

  /**
   * A user hovers over a symbol in the matrix. Highlight a cell in range of the scope.
   */
  const handleMouseOver = effect((event: MouseEvent) => {
    const cellToHighlight = getCellToHighlight(event);
    const matrixHighlightEvent = new CustomEvent('cell-highlight', { detail: cellToHighlight?.dataset });
    eventBus.dispatchEvent(matrixHighlightEvent);

    if (!cellToHighlight) return;

    return classListEffect(highlightClass, cellToHighlight);
  });

  /**
   * A user hovers over a symbol in a sequence. Highlight all cells containing the symbol.
   */
  const handleSymbolSearch = effect((event: CustomEvent) => {
    const symbol = event.detail;
    if (!symbol) return;

    const cellsToShow = cells.filter(findCell, { symbol, disabled: false });

    return classListEffect(queryClass, cellsToShow);
  });

  const abortController = new AbortController();
  const signal = abortController.signal;

  cellsContainer.addEventListener('mouseover', handleMouseOver, { signal });
  cellsContainer.addEventListener('click', handleClick, { signal });
  eventBus.addEventListener('symbol-search', handleSymbolSearch, { signal });
  eventBus.addEventListener('game-end', () => abortController.abort(), { once: true });

  return view;
};
