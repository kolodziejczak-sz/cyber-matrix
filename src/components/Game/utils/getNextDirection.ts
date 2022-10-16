import { Direction } from '@/components/Game/types';

export const getNextDirection = (direction: Direction) => {
  return direction === 'row' ? 'column' : 'row';
};
