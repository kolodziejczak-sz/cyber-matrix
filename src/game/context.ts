import { Context, GameSettings } from '@/game/types';
import { getMatrix } from '@/game/getMatrix';
import { getSequences } from '@/game/getSequences';

let context: Context;

export const getContext = (): Context => {
  if (!context) {
    throw new Error('Please initialize context');
  }

  return context;
};

export const initContext = (settings: GameSettings) => {
  const { matrixSettings } = settings;

  const eventBus = new EventTarget();
  const matrix = getMatrix(matrixSettings.rowLength); 
  const sequences = getSequences(matrix, settings);
  const buffer = [];

  context = {
    sequences,
    buffer,
    settings,
    eventBus,
    matrix,
  }
}