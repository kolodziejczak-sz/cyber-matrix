import { Scope } from './getScope';
import { findCell } from './findCell';
import { getRandomInteger } from '@/utils/getRandomInteger';

// musi byc context jak redux, subskrybcja

type Sequence = string[];

type Sequences = {
  easy: Sequence,
  medium: Sequence,
  hard: Sequence,
};

const sequenceLevels = ['easy', 'medium', 'hard'];

const getNextDirection = (direction: 'row' | 'column') => {
  return direction === 'row' ? 'column' : 'row';
}

export const getSequences = (size: number, initialScope: Scope, cells: HTMLElement[]) => {
  const { direction, index } = initialScope;
  const getRandomX = () => getRandomInteger(0, size);

  const firstSymbol = cells
    .filter(findCell, { [direction]: index, })
    .map(cell => cell.dataset.symbol)[getRandomX()]

  console.log(
    cells.filter(findCell, { [direction]: index, }),
    index,
    direction
  )
  return firstSymbol;
};
