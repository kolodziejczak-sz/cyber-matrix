import { Scope } from '@/game/types';
import { effect } from '@/utils/effect';
import { findCell } from '@/game/findCell';

const cellClass = 'matrix__cell--scope';
const containerClasses = {
  row: 'matrix__scope-horizontal',
  column: 'matrix__scope-vertical'
};

export const createScope = (container: HTMLElement, initialScope: Scope) => {
  const cells = Array.from(container.children);

  let value = initialScope;

  const getValue = (): Scope | undefined => {
    return value;
  } 

  const moveTo = effect((nextScope: Scope) => {
    value = nextScope;

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

  moveTo(initialScope);

  return {
    moveTo,
    getValue,
  };
}