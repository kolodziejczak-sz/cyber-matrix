import { Context } from '@/components/Game/types';

let context: Context;

export const getContext = (): Context => {
  if (!context) {
    throw new Error('Please initialize context');
  }

  return context;
};

export const setContext = (value: Context) => {
  context = value;
}
