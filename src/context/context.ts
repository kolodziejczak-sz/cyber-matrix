import { getMatrix } from './getMatrix';
import { getSequences } from './getSequences';
import { Context, GameSettings } from './types';

let context: Context;

export const getContext = (): Context => {
  if (!context) {
    throw new Error('Please initialize context');
  }

  return context;
};

export const patchContext = (payload: Partial<Context>) => {

}

export const initContext = (settings: GameSettings) => {
  const { scopeSettings, matrixSettings, sequencesSettings } = settings;

  const eventBus = new EventTarget();
  const matrix = getMatrix(matrixSettings.rowLength); 
  const sequences = getSequences(sequencesSettings, scopeSettings, matrix);
  const buffor = [];

  context = {
    sequences,
    buffor,
    settings,
    eventBus,
    matrix,
  }
}