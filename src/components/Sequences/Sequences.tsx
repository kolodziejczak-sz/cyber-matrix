import { getContext } from '@/game/context';

import './Sequences.css';

type Props = {
  className: string;
}

export const Sequences = ({ className }: Props) => {
  const { sequences } = getContext();

  const cells = [];

  const longestSequence = Math.max(
    ...sequences.map(({ length }) => length)
  );

  const items = sequences.map(({ symbols, points }, rowIndex) => {
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
    )
  })

  return (
    <div class={`sequences card ${className}`}>
      <div class="card__header card__header--secondary">
        Seuqence required to upload
      </div>
      <ul class="sequences__list" style={`--sequences-size:${longestSequence};`}>
        {items}
      </ul>
    </div>
  )
};