import { Matrix, Sequences, Sequence, GameSettings, Direction, SequenceSettings } from '@/components/Game/types';
import { getRandomInteger } from '@/components/Game/generators/getRandomInteger';
import { getNextDirection } from '@/components/Game/generators/getNextDirection';

export const getSequences = (
  matrix: Matrix,
  settings: GameSettings,
): Sequences => {
  const { rowLength, symbols } = matrix;

  const { scopeSettings: initialScope, sequencesSettings, bufferSettings } = settings;
  const { direction, index } = initialScope;
  const { length: bufferLength } = bufferSettings;

  const getRandomCoord = () => getRandomInteger(0, rowLength - 1);

  const getRandomDir = (initialDir: Direction, range: number) => {
    const offset = getRandomInteger(0, range);
    const shouldChangeDir = Boolean(offset % 2);

    return shouldChangeDir ? getNextDirection(initialDir) : initialDir;
  };

  const createSequence = ({ length, points, name }: SequenceSettings) => {
    const sequenceSymbols: string[] = [];
    const usedIndexes: number[] = [];
    const bufferMaxOffset = bufferLength - length;
  
    let dir = bufferMaxOffset === 0 ? direction : getRandomDir(direction, bufferMaxOffset);
    let idx = bufferMaxOffset === 0 ? index : getRandomCoord();

    for (let i = 0; i < length; i++) {
      let query, symbolIndex;

      do {
        query = { row: getRandomCoord(), column: getRandomCoord(), [dir]: idx };
        symbolIndex = (query.row * rowLength) + query.column;
      } while (usedIndexes.includes(symbolIndex))

      usedIndexes.push(symbolIndex);
      sequenceSymbols.push(symbols[symbolIndex]);

      dir = getNextDirection(dir);
      idx = query[dir];
    }

    return {
      length,
      name,
      points,
      symbols: sequenceSymbols
    };
  };

  const sequences = [];

  const isDuplication = (sequenceToValidate: Sequence) => {
    return sequences.some((sequence: Sequence) => (
      sequence.symbols.join('') === sequenceToValidate.symbols.join('')
    ));
  };

  sequencesSettings.forEach((sequenceSetting: SequenceSettings) => {
    let sequence: Sequence;
    do {
      sequence = createSequence(sequenceSetting)
    } while (isDuplication(sequence))

    sequences.push(sequence);
  });

  return sequences;
};
