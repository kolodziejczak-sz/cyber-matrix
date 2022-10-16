import { GameData } from '@/components/Game/types';
import { getController } from '@/components/Game/generators/getController';
import { getInitialScope } from '@/components/Game/generators/getInitialScope';
import { getMatrix } from '@/components/Game/generators/getMatrix';
import { getSequences } from '@/components/Game/generators/getSequences';
import { getTimerDuration } from '@/components/Game/generators/getTimerDuration';
import { getRandomInteger } from '@/components/Game/generators/getRandomInteger';

type Props = Partial<GameData>;

export const getGameData = (props: Props = {}): GameData => {
  const eventBus = props.eventBus || new EventTarget();
  const controller = props.controller || getController();
  const initialScope = props.initialScope || getInitialScope();
  const matrix = props.matrix || getMatrix(getRandomInteger(4, 6)); 
  const bufferLength = props.bufferLength || getRandomInteger(4, 8);
  const sequences = props.sequences || getSequences({
    bufferLength,
    initialScope,
    matrix,
    sequenceCount: 3,
  });
  const timerDuration = props.timerDuration || getTimerDuration(sequences);

  return {
    bufferLength,
    controller,
    eventBus,
    initialScope,
    matrix,
    sequences,
    timerDuration,
  };
};
