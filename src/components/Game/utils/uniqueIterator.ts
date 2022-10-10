export const uniqueIterator = <TResult>(action: () => TResult) => {
  const results: TResult[] = [];

  const next = () => {
    let result: TResult;
    do {
      result = action();
    } while (results.includes(result))

    results.push(result);

    return result;
  };
  
  return {
    next,
  };
}