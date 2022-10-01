import { effect } from '@/utils/effect';
import { findCell } from './findCell';

export type Scope = {
  index: number,
  direction: 'row' | 'column',
}

export const getScope = (container: HTMLElement) => {
  const cells = Array.from(container.children);
  const cellClass = 'matrix__button--scope';
  const containerClasses = {
    row: 'matrix__scope-horizontal',
    column: 'matrix__scope-vertical'
  };

  let scope: Scope | undefined;

  const getCurrentScope = (): Scope | undefined => {
    return scope;
  } 

  const moveTo = effect((nextScope: Scope) => {
    scope = nextScope;

    const { direction, index } = nextScope;

    const nextContainerClass = containerClasses[direction];
    container.classList.add(nextContainerClass);

    const cell = cells.find(findCell, { [direction]: index });
    cell.classList.add(cellClass);

    return () => {
      container.classList.remove(nextContainerClass);
      cell.classList.remove(cellClass);
    };
  });

  return {
    moveTo,
    getCurrentScope,
  };
}