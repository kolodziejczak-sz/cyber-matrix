import { Direction } from '@/game/types';

export const getNextDirection = (direction: Direction) => {
  return direction === 'row' ? 'column' : 'row';
};