type Effect = ((...args: any[]) => void) | ((...args: any[]) => () => void);

export const effect = <T extends Effect>(action: T) => {
  let cleanup: Function | void;

  const wrapper = (...args) => {
    if (cleanup) {
      cleanup();
    }
    cleanup = action(...args);
  };

  return wrapper as T;
};
