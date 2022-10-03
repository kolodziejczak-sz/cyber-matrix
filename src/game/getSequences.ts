import { getRandomInteger } from '@/utils/getRandomInteger';
import { getNextDirection } from '@/game/getNextDirection';
import { Matrix, Sequences, Sequence, SequencesSettings, ScopeSettings } from '@/game/types';

export const getSequences = (
  sequencesSettings: SequencesSettings,
  initialScope: ScopeSettings,
  matrix: Matrix,
): Sequences => {
  const { rowLength, symbols } = matrix;
  const { direction, index } = initialScope;

  const getCoord = () => getRandomInteger(0, rowLength - 1);

  return sequencesSettings.map<Sequence>(({ length, points }) => {
    let dir = direction;
    const sequenceSymbols: string[] = [];

    for (let i = 0; i < length; i++) {
      const query = { row: getCoord(), column: getCoord(), [dir]: index };
      const symbolIndex = (query.column * rowLength) + query.row;

      sequenceSymbols.push(symbols[symbolIndex]);  
      dir = getNextDirection(dir);
    }

    return {
      length,
      points,
      symbols: sequenceSymbols
    };
  });
};
