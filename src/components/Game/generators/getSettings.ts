import { getRandomInteger } from '@/components/Game/generators/getRandomInteger';
import { GameSettings } from '@/components/Game/types';

export const getSettings = () => {
  const controllerQuery = window.matchMedia('(pointer: coarse)');
  const bufferLength = getRandomInteger(4, 6);
  const matrixLength = getRandomInteger(5, 7);

  const gameSettings: GameSettings = {
    bufferSettings: { length: bufferLength },
    controllerSettings: controllerQuery.matches ? 'touch' : 'mouse',
    matrixSettings: { rowLength: matrixLength },
    scopeSettings: { index: 0, direction: 'row' },
    sequencesSettings: [
      { length: 2, points: 100, },
      { length: 3, points: 200, },
      { length: 4, points: 400, },
    ],
    timerSettings: { duration: 106_600 },
  };
  
  return gameSettings;
}