type FindCellQuery = {
  row?: number,
  column?: number,
  symbol?: string,
  disabled?: string;
}

export function findCell (this: FindCellQuery, element: HTMLElement): boolean {
  const {
    row: targetRow,
    column: targetColumn,
    symbol: targetSymbol,
    disabled: targetDisabled,
  } = this;

  const { row, column, symbol, disabled } = element.dataset;

  return (targetRow === undefined ? true : targetRow === Number(row))
    && (targetColumn === undefined ? true : targetColumn === Number(column))
    && (targetSymbol === undefined ? true : targetSymbol === symbol)
    && (targetDisabled === undefined ? true: targetDisabled === disabled)
}
