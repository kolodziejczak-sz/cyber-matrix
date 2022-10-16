import { Matrix, Sequences, Sequence, Direction, Scope, Symbols } from '@/components/Game/types';
import { getRandomInteger } from '@/components/Game/generators/getRandomInteger';
import { getNextDirection } from '@/components/Game/utils/getNextDirection';

type SequenceSettings = Omit<Sequence, 'symbols'>;

const getSequencesSettings = (
  sequenceCount: number,
  bufferLength: number
): SequenceSettings[] => {
  return Array.from({ length: sequenceCount }).map((_, index) => {
    const min = 2;
    const max = Math.min(
      Math.max(min + sequenceCount, bufferLength - min),
      bufferLength
    );

    const length = getRandomInteger(min, max);
    const points = ((length - 1) * 100) * (length * 0.25);
    const name = `MINE_V${index}` 

    return { length, name, points };
  });
};

type Props = {
  matrix: Matrix;
  bufferLength: number;
  initialScope: Scope;
  sequenceCount: number;
};

export const getSequences = ({
  matrix,
  bufferLength,
  initialScope,
  sequenceCount,
}: Props): Sequences => {
  const { rowLength, symbols } = matrix;
  const { direction, index } = initialScope;

  const getRandomCoord = () => getRandomInteger(0, rowLength - 1);

  const getRandomDir = (initialDir: Direction, range: number) => {
    const offset = getRandomInteger(0, range);
    const shouldChangeDir = Boolean(offset % 2);

    return shouldChangeDir ? getNextDirection(initialDir) : initialDir;
  };

  const createSymbolsForSequence = (length: number) => {
    const sequenceSymbols: Symbols = [];
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

    return sequenceSymbols;
  };

  const sequencesSettings = getSequencesSettings(sequenceCount, bufferLength);
  const sequences: Sequences = [];

  const isDuplication = (symbolsToValidate: Symbols) => {
    return sequences.some((sequence) => (
      sequence.symbols.join('') === symbolsToValidate.join('')
    ));
  };

  sequencesSettings.forEach((sequenceSettings: SequenceSettings) => {
    let sequenceSymbols: Symbols;
    do {
      sequenceSymbols = createSymbolsForSequence(sequenceSettings.length)
    } while (isDuplication(sequenceSymbols))

    sequences.push({
      ...sequenceSettings,
      symbols: sequenceSymbols
    });
  });

  return sequences;
};
