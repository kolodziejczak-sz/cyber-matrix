import { getSettings } from '@/components/Game/generators/getSettings';
import { getMatrix } from '@/components/Game/generators/getMatrix';
import { getSequences } from '@/components/Game/generators/getSequences';
import { GameSettings } from '@/components/Game/types';
import { setContext } from '@/components/Game/context';
import { Timer } from '@/components/Game/components/Timer';
import { Buffer } from '@/components/Game/components/Buffer';
import { Matrix } from '@/components/Game/components/Matrix';
import { Sequences } from '@/components/Game/components/Sequences';
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

  return (
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
}