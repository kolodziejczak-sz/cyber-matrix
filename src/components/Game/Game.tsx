import { getSettings } from '@/components/Game/generators/getSettings';
import { getMatrix } from '@/components/Game/generators/getMatrix';
import { getSequences } from '@/components/Game/generators/getSequences';
import { GameSettings } from '@/components/Game/types';
import { setContext } from '@/components/Game/context';
import { waitForEvent } from '@/components/Game/utils/waitForEvent';
import { Timer } from '@/components/Game/components/Timer';
import { Buffer } from '@/components/Game/components/Buffer';
import { Matrix } from '@/components/Game/components/Matrix';
import { Sequences } from '@/components/Game/components/Sequences';
import { Score } from '@/components/Game/components/Score';
import { Button } from '@/components/Button';

import './Game.css';

type GameProps = {
  settings?: GameSettings;
};

export const Game = ({
  settings = getSettings()
}: GameProps) => {
  const eventBus = new EventTarget();
  const matrix = getMatrix(settings.matrixSettings.rowLength); 
  const sequences = getSequences(matrix, settings);

  const context = {
    eventBus,
    matrix,
    settings,
    sequences,
  };
  
  setContext(context);

  const handleExitGame = () => {
    eventBus.dispatchEvent(new CustomEvent('game-end', { detail: 'exit' }));
  };

  const view = (
    <div class="game">
      <Timer className="game__timer" />
      <Buffer className="game__buffer" />
      <Sequences className="game__sequences" />
      <Matrix className="game__matrix" />
      <Button
        className="game__exit"
        text="Exit interface"
        onClick={handleExitGame}
      />
    </div>
  )

  eventBus.addEventListener('game-end', async (event: CustomEvent<string>) => {
    const { detail: gameEndReason } = event;

    // if (gameEndReason === 'exit');

    console.log('gameend', gameEndReason)
    const { detail: sequencesStatus } = await waitForEvent<CustomEvent<Array<boolean>>>(eventBus, 'sequences-status');

    const points = sequences.reduce((sum, { points }, sequenceIndex) => {
      const hasSequenceSucceed = sequencesStatus[sequenceIndex] === true;
      const pointsForSequence = hasSequenceSucceed ? points : 0;

      return sum + pointsForSequence;
    }, 0);

    console.log(points);

    const score = (
      <Score className="game__score cut-top-border" points={points} />
     ) as HTMLDialogElement;

    view.prepend(score);

    score.showModal();


  }, { once: true })

  return view;
}