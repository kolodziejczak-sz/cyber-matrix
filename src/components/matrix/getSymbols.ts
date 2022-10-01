import { getRandomInteger } from "../../utils/getRandomInteger";

const getUniqueSymbols = (symbolCount: number) => {
  const symbols = new Set<string>();

  while (symbols.size !== symbolCount) {
    const symbol = getRandomInteger(160, 255).toString(16);
    symbols.add(symbol);
  }

  return Array.from(symbols);
};

export const getSymbols = (width: number) => {
  const symbols = getUniqueSymbols(width);
  const size = width * width;

  const array = Array.from({ length: size }).map(() => {
    const index = getRandomInteger(0, symbols.length - 1);
    return symbols[index];
  });

  return { array, width };
};