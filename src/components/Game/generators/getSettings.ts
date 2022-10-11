import { getRandomInteger } from '@/components/Game/generators/getRandomInteger';
import { GameSettings } from '@/components/Game/types';
import { uniqueIterator } from '@/components/Game/utils/uniqueIterator';

export const getSettings = () => {
  const controllerQuery = window.matchMedia('(pointer: coarse)');
  const bufferLength = getRandomInteger(4, 8);
  const matrixLength = getRandomInteger(4, 6);

  const sequenceCount = 3;
  const sequenceLengthGenerator = uniqueIterator(() => {
    const min = 2;
    const max = Math.max(min + sequenceCount, bufferLength  - min);

    return getRandomInteger(min, max);
  });

  const sequencesSettings = Array.from({ length: sequenceCount }).map((_, index) => {
    const length = sequenceLengthGenerator.next();
    const points = ((length - 1) * 100) * (length * 0.25);
    const name = `Datamine_V${index}` 

    return { length, name, points };
  });

  const timerDuration = sequencesSettings.reduce(
    (sum, sequence) => sum + (sequence.points * 63), 0
  );

  const gameSettings: GameSettings = {
    controllerSettings: controllerQuery.matches ? 'touch' : 'mouse',
    bufferSettings: { length: bufferLength },
    matrixSettings: { rowLength: matrixLength },
    scopeSettings: { index: 0, direction: 'row' },
    sequencesSettings: sequencesSettings,
    timerSettings: { duration: timerDuration },
  };
  
  return gameSettings;
}