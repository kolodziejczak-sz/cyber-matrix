import { App } from '@/components/App';
import { GameSettings } from '@/game/types';
import { initContext } from '@/game/context';

import './styles.css';

const gameSettings: GameSettings = {
  scopeSettings: { index: 0, direction: 'row' },
  matrixSettings: { rowLength: 5 },
  sequencesSettings: [
    { length: 2, points: 100, },
    { length: 3, points: 200, },
    { length: 4, points: 400, },
  ],
  bufferSettings: { length: 5 },
  timerSettings: { duration: 12_600 },
};

initContext(gameSettings);

const root = document.getElementById('root');

root.appendChild(<App />);