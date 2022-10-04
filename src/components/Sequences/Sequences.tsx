import { getContext } from '@/game/context';
import { findCell } from '@/game/findCell';
import { classListEffect } from '@/utils/classListEffect';
import { effect } from '@/utils/effect';

import './Sequences.css';

type Props = {
  className: string;
}

export const Sequences = ({ className }: Props) => {
  const { sequences, eventBus, settings } = getContext();

  const cells: HTMLElement[] = [];
  const rows = sequences.map(({ symbols, points }, rowIndex) => {
    return (
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
    );
  });

  let scopeIndex;

  const pushScope = effect((columnIndex: number) => {
    scopeIndex = columnIndex;

    const className = 'sequences__cell--scope';
    const cell = cells.find(findCell, { column: columnIndex });

    return classListEffect(className, cell);
  });

  const pushRow = (rowIndex: number) => {
    const rowCells = cells.filter(findCell, { row: rowIndex });

    rowCells.forEach(cell => {
      const nextColumn = (Number(cell.dataset.column) + 1).toString()
      cell.setAttribute('data-column', nextColumn);
    });

    rows[rowIndex].prepend(
      <button
        data-row={rowIndex.toString()}
        data-column="0"
        data-disabled="true"
      />
    );
  };

  const listHandler = (el) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    /**
     * Request the matrix to highlight a symbol currently selected by a user.
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
      const symbol = event.detail?.symbol;
      if (!symbol) {
        return;
      }

      const className = 'sequences__cell--highlight';
      const symbolsToHighlight = cells.filter(findCell, { symbol, column: scopeIndex });

      return classListEffect(className, symbolsToHighlight);
    });

    /**
     * A cell in the matrix has been selected. Highlight a selected symbol in sequences.
     */
    const handleMatrixCellSelect = (event: CustomEvent) => {
      const symbol = event.detail.symbol;

      const className = 'sequences__cell--selected';
      const symbolsToHighlight = cells.filter(findCell, { symbol, column: scopeIndex });

      symbolsToHighlight.forEach(el => {
        const { row, column } = el.dataset;

        // might be unnecessary, cuz the sequence might already failed
        const prevSymbol = cells.find(findCell, { column: Number(column) - 1, row: Number(row) });
        if (!prevSymbol || prevSymbol.classList.contains(className)) {
          el.classList.add(className)
        }
      });

      // pushRow - wait for buffer?
      pushScope(scopeIndex + 1);
    };

    el.addEventListener('mouseover', handleMouseOver, { signal });
    eventBus.addEventListener('cell-highlight', handleMatrixCellHightlight, { signal });
    eventBus.addEventListener('cell-select', handleMatrixCellSelect, { signal });
    eventBus.addEventListener('game-end', () => abortController.abort(), { signal, once: true });

    return () => {
      abortController.abort();
    };
  }

  const bufferLength = settings.bufferSettings.length;
  const longestSequence = Math.max(
    bufferLength,
    ...sequences.map(({ length }) => length)
  );

  pushScope(0);


  return (
    <div class={`${className} sequences card`}>
      <div class="card__header card__header--secondary">
        Seuqence required to upload
      </div>
      <ul
        class="sequences__list"
        style={`--sequences-size:${longestSequence};`}
        ref={listHandler}
      >
        {rows}
      </ul>
    </div>
  )
};