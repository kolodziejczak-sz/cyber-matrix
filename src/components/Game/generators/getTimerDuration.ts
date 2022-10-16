import { Sequences } from '@/components/Game/types';

export const getTimerDuration = (sequences: Sequences) => {
  return sequences.reduce(
    (sum, sequence) => sum + (sequence.points * 43), 0,
  );
};
