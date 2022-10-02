import { Matrix } from '@/components/Matrix';
import { GameSettings } from '@/game/types';
import { initContext } from '@/game/context';

import './styles.css';

const gameSettings: GameSettings = {
  scopeSettings: { index: 0, direction: 'row' },
  matrixSettings: { rowLength: 5 },
  sequencesSettings: {
    easy: { length: 3, points: 100, },
    medium: { length: 4, points: 200, },
    hard: { length: 5, points: 400, },
  },
  bufforSettings: { length: 5 },
  timerSettings: { duration: 30_000 },
};

initContext(gameSettings);

const root = document.getElementById('root');
const app = <Matrix />;

root.appendChild(app);