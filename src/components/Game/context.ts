import { GameData } from '@/components/Game/types';

let context: GameData;

export const getContext = (): GameData => {
  if (!context) {
    throw new Error('Please initialize context');
  }

  return context;
};

export const setContext = (value: GameData) => {
  context = value;
};
