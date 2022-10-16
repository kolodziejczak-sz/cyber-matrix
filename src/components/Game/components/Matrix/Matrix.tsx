import { getContext } from '@/components/Game/context';
import { effect } from '@/components/Game/utils/effect';
import { classNameEffect } from '@/components/Game/utils/classNameEffect';
import { getNextDirection } from '@/components/Game/utils/getNextDirection';
import { findCell } from '@/components/Game/utils/findCell';
import { createScope } from '@/components/Game/components/Matrix/scope';

import './Matrix.css';

type Props = {
  className: string;
}

export const Matrix = ({ className }: Props) => {
  const { eventBus, matrix, initialScope, controller } = getContext();
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
    <div class={`${className} matrix cut-top-corner`}>
      <header class="matrix__header">Code Matrix</header>
      {cellsContainer}
    </div>
  );

  const selectedClass = 'matrix__cell--selected';
  const highlightClass = 'matrix__cell--highlight';
  const queryClass = 'matrix__cell--query';
  const scope = createScope({
    cells,
    container: cellsContainer,
    initialScope
  });

  /**
   * Find a cell to highlight within the scope.
   */
  const getCellToHighlight = (event: Event) => {
    const { row, column } = (event.target as HTMLElement).dataset;
    if (event.type.endsWith('out') || (!row && !column)) return;

    const { direction, index } = scope.getValue();

    return cells.find(findCell, {
      row: Number(row),
      column: Number(column),
      [direction]: index,
    });
  };

  /**
   * A user selected a symbol in the matrix. Propagate a highlighted cell.
   */
  const handleSelect = (event: Event) => {
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

    handleHover(event);
  };

  /**
   * A user hovers over a symbol in the matrix. Highlight a cell in the scope range.
   */
  const handleHover = effect((event: Event) => {
    const cellToHighlight = getCellToHighlight(event);
    const matrixHighlightEvent = new CustomEvent('cell-highlight', { detail: cellToHighlight?.dataset });
    eventBus.dispatchEvent(matrixHighlightEvent);

    if (!cellToHighlight) return;

    return classNameEffect(highlightClass, cellToHighlight);
  });

  /**
   * A user hovers over a symbol in a sequence. Highlight all cells containing the symbol.
   */
  const handleSymbolSearch = effect((event: CustomEvent<string>) => {
    const symbol = event.detail;
    if (!symbol) return;

    const cellsToShow = cells.filter(findCell, { symbol, disabled: false });

    return classNameEffect(queryClass, cellsToShow);
  });

  const abortController = new AbortController();
  const signal = abortController.signal;

  if (controller === 'touch') {
    cellsContainer.addEventListener('focusin', handleHover, { signal });
    cellsContainer.addEventListener('focusout', handleHover, { signal });
    cellsContainer.addEventListener('dblclick', handleSelect, { signal });
  } else {
    cellsContainer.addEventListener('mouseover', handleHover, { signal });
    cellsContainer.addEventListener('mouseout', handleHover, { signal });
    cellsContainer.addEventListener('click', handleSelect, { signal });
  }

  eventBus.addEventListener('symbol-search', handleSymbolSearch, { signal });
  eventBus.addEventListener('game-end', () => abortController.abort(), { once: true });

  return view;
};
