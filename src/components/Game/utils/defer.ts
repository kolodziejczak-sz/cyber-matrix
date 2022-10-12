export const defer = (callback: Function, ms: number = 0) => {
  setTimeout(() => callback(), ms);
};
