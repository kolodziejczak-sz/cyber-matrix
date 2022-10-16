import { Scope } from '@/components/Game/types';

export const getInitialScope = (): Scope => {
  return { index: 0, direction: 'row' };
};
