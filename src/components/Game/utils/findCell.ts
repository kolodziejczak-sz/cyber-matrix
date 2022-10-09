type FindCellQuery = {
  row?: number,
  column?: number,
  symbol?: string,
  disabled?: boolean;
}

export function findCell (this: FindCellQuery, element: HTMLElement): boolean {
  const {
    row: targetRow,
    column: targetColumn,
    symbol: targetSymbol,
    disabled: targetDisabled,
  } = this;

  const { row, column, symbol, disabled } = element.dataset;

  return (targetRow === undefined || targetRow === Number(row))
    && (targetColumn === undefined || targetColumn === Number(column))
    && (targetSymbol === undefined || targetSymbol === symbol)
    && (targetDisabled === undefined || String(targetDisabled) === String(Boolean(disabled)))
}
