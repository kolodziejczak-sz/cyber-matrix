type FindCellQuery = {
  row?: number,
  column?: number,
  symbol?: string,
}

export function findCell (this: FindCellQuery, element: HTMLElement): boolean {
  const {
    row: targetRow,
    column: targetColumn,
    symbol: targetSymbol,
  } = this;

  const { row, column, symbol } = element.dataset;

  return (targetRow === undefined ? true : targetRow === Number(row))
    && (targetColumn === undefined ? true : targetColumn === Number(column))
    && (targetSymbol === undefined ? true : targetSymbol === symbol);
}
