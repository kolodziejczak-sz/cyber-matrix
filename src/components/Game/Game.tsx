import { GameData, GameEndData } from '@/components/Game/types';
import { setContext } from '@/components/Game/context';
import { getGameData } from '@/components/Game/generators/getGameData';
import { waitForEvent } from '@/components/Game/utils/waitForEvent';
import { defer } from '@/components/Game/utils/defer';
import { Timer } from '@/components/Game/components/Timer';
import { Buffer } from '@/components/Game/components/Buffer';
import { Matrix } from '@/components/Game/components/Matrix';
import { Sequences } from '@/components/Game/components/Sequences';
import { Exit } from '@/components/Game/components/Exit';
import { Score } from '@/components/Game/components/Score';

import './Game.css';

type Props = {
  onExit: () => void;
  onPlayAgain: () => void;
  partialGameData?: Partial<GameData>;
};

export const Game = ({ partialGameData, onExit, onPlayAgain }: Props) => {
  const gameData = getGameData(partialGameData);
  const { eventBus, sequences } = gameData;
  
  setContext(gameData);

  const endGame = () => {
    eventBus.dispatchEvent(new CustomEvent('game-end', { detail: 'exit' }));
  };

  eventBus.addEventListener('game-end', async (event: CustomEvent<string>) => {
    const { detail: reason } = event;
    if (reason === 'exit') {
      return onExit();
    }

    const { detail: sequencesData } = await waitForEvent<CustomEvent<boolean[]>>(eventBus, 'sequences-data');
    const gameEndData: GameEndData = {
      reason,
      sequences: sequences.map((sequence, sequenceIndex) => ({
        ...sequence,
        succeed: Boolean(sequencesData[sequenceIndex]),
      })),
    };

    const scoreBoard = (
      <Score
        gameEndData={gameEndData}
        onMainMenu={onExit}
        onPlayAgain={onPlayAgain}
      />
    );

    defer(() => codeMatrix.replaceWith(scoreBoard), 600);
  }, { once: true })

  const codeMatrix = <Matrix className="game__matrix" />;

  return (
    <div class="game">
      <Timer className="game__timer" />
      <div class="game__buffer-and-exit">
        <Buffer />
        <Exit onClick={endGame}/>
      </div>
      <Sequences className="game__sequences" />
      {codeMatrix}
    </div>
  );
}