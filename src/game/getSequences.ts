import { getRandomInteger } from '@/utils/getRandomInteger';
import { getNextDirection } from '@/game/getNextDirection';
import { Matrix, Sequences, SequencesSettings, ScopeSettings } from '@/game/types';

export const getSequences = (
  sequencesSettings: SequencesSettings,
  initialScope: ScopeSettings,
  matrix: Matrix,
): Sequences => {
  const { rowLength, symbols } = matrix;
  const { direction, index } = initialScope;

  const getCoord = () => getRandomInteger(0, rowLength - 1);
  const sequenceLevels = Object.keys(sequencesSettings);

  const sequences = sequenceLevels.reduce((acc, levelName) => {
    const levelLength = sequencesSettings[levelName].length;
    acc[levelName] = [];

    let dir = direction;
    for (let i = 0; i < levelLength; i++) {
      const query = { row: getCoord(), column: getCoord(), [dir]: index };
      const symbolIndex = (query.column * rowLength) + query.row;

      acc[levelName].push(symbols[symbolIndex]);  
      dir = getNextDirection(dir);
    }

    return acc;
  }, {} as Sequences);

  return sequences;
};
