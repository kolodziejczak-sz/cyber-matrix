export const defer = (callback: Function) => {
  setTimeout(() => callback());
};
