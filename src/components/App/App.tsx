import { getRandomInteger } from '@/utils/getRandomInteger';
import { GameSettings } from '@/game/types';
import { initContext } from '@/game/context';
import { Timer } from '@/components/Timer';
import { Buffer } from '@/components/Buffer';
import { Matrix } from '@/components/Matrix';
import { Sequences } from '@/components/Sequences';

import './App.css';

export const App = () => {
  const matrixLength = getRandomInteger(5, 7);
  const bufferLength = getRandomInteger(4, 6);

  const controllerQuery = window.matchMedia('(pointer: coarse)');

  const gameSettings: GameSettings = {
    controllerSettings: controllerQuery.matches ? 'touch' : 'mouse',
    bufferSettings: { length: bufferLength },
    matrixSettings: { rowLength: matrixLength },
    scopeSettings: { index: 0, direction: 'row' },
    sequencesSettings: [
      { length: 2, points: 100, },
      { length: 3, points: 200, },
      { length: 4, points: 400, },
    ],
    timerSettings: { duration: 106_600 },
  };
  
  initContext(gameSettings);

  return (
    <div class="app">
      <Timer className="app__timer" />
      <Buffer className="app__buffer" />
      <Sequences className="app__sequences" />
      <Matrix className="app__matrix" />
    </div>
  )
}