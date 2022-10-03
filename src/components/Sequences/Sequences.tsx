import { getContext } from '@/game/context';
import { findCell } from '@/game/findCell';

import './Sequences.css';

type Props = {
  className: string;
}

export const Sequences = ({ className }: Props) => {
  const { sequences, settings } = getContext();
  const bufferLength = settings.bufferSettings.length;

  const longestSequence = Math.max(
    bufferLength,
    ...sequences.map(({ length }) => length)
  );

  const cells: HTMLElement[] = [];
  const rows = sequences.map(({ symbols, points }, rowIndex) => {
    return (
      <li class="sequences__item">
        {symbols.map((symbol, columnIndex) => {
          const cell = (
            <button
              class="sequences__symbol"
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

  return (
    <div class={`sequences card ${className}`}>
      <div class="card__header card__header--secondary">
        Seuqence required to upload
      </div>
      <ul class="sequences__list" style={`--sequences-size:${longestSequence};`}>
        {rows}
      </ul>
    </div>
  )
};