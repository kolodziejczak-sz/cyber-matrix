import { getRandomInteger } from '@/utils/getRandomInteger';
import { Matrix } from '@/game/types';

const getUniqueSymbols = (symbolCount: number) => {
  const symbols = new Set<string>();

  while (symbols.size !== symbolCount) {
    const symbol = getRandomInteger(160, 255).toString(16);
    symbols.add(symbol);
  }

  return Array.from(symbols);
};

export const getMatrix = (rowLength: number): Matrix => {
  const uniqueSymbols = getUniqueSymbols(rowLength);
  const size = rowLength * rowLength;

  const symbols = Array.from({ length: size }).map(() => {
    const index = getRandomInteger(0, uniqueSymbols.length - 1);
    return uniqueSymbols[index];
  });

  return { symbols, rowLength };
};