import { getSettings } from '@/components/Game/generators/getSettings';
import { getMatrix } from '@/components/Game/generators/getMatrix';
import { getSequences } from '@/components/Game/generators/getSequences';
import { GameEndStatus, GameSettings } from '@/components/Game/types';
import { setContext } from '@/components/Game/context';
import { waitForEvent } from '@/components/Game/utils/waitForEvent';
import { Timer } from '@/components/Game/components/Timer';
import { Buffer } from '@/components/Game/components/Buffer';
import { Matrix } from '@/components/Game/components/Matrix';
import { Sequences } from '@/components/Game/components/Sequences';
import { Exit } from '@/components/Game/components/Exit';

import './Game.css';


type Props = {
  settings?: GameSettings;
  onEnd: (reason: string, gameEndStatus: GameEndStatus) => void;
};

export const Game = ({
  settings = getSettings(),
  onEnd,
}: Props) => {
  const eventBus = new EventTarget();
  const matrix = getMatrix(settings.matrixSettings.rowLength); 
  const sequences = getSequences(matrix, settings);

  setContext({
    eventBus,
    matrix,
    settings,
    sequences,
  });

  const handleExitGame = () => {
    eventBus.dispatchEvent(new CustomEvent('game-end', { detail: 'exit' }));
  };

  eventBus.addEventListener('game-end', async (event: CustomEvent<string>) => {
    const { detail: reason } = event;
    const { detail: sequencesStatus } = await waitForEvent<CustomEvent<boolean[]>>(eventBus, 'sequences-status');
    const gameEndStatus: GameEndStatus = sequences.map((sequence, sequenceIndex) => ({
        ...sequence,
        succeed: Boolean(sequencesStatus[sequenceIndex]),
    }));

    onEnd(reason, gameEndStatus);
  }, { once: true })

  return (
    <div class="game">
      <Timer className="game__timer" />
      <div class="game__buffer-and-exit">
        <Buffer />
        <Exit onClick={handleExitGame}/>
      </div>
      <Sequences className="game__sequences" />
      <Matrix className="game__matrix" />
    </div>
  );
}