import { Controller } from '@/components/Game/types';

export const getController = (): Controller => {
  const controllerQuery = window.matchMedia('(pointer: coarse)');

  return controllerQuery.matches ? 'touch' : 'mouse';
};