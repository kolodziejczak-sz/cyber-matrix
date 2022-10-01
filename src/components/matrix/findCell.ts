export function findCell (this: { symbol: string }, element: HTMLElement): boolean;
export function findCell (this: { row?: number, column?: number }, element: HTMLElement): boolean;
export function findCell (this: { row?: number, column?: number, symbol?: string }, element: HTMLElement): boolean {
  const {
    row: targetRow = 0,
    column: targetColumn = 0,
    symbol: targetSymbol,
  } = this;

  const { row, column, symbol } = element.dataset;

  if (targetSymbol) {
    return targetSymbol === symbol;
  }

  return targetRow === Number(row) && targetColumn === Number(column);
}
