import { Direction } from "@/context/types";

export const getNextDirection = (direction: Direction) => {
  return direction === 'row' ? 'column' : 'row';
};