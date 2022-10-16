import { Scope } from '@/components/Game/types';
import { effect } from '@/components/Game/utils/effect';
import { findCell } from '@/components/Game/utils/findCell';

const cellClass = 'matrix__cell--scope';
const containerClasses = {
  row: 'matrix__scope-horizontal',
  column: 'matrix__scope-vertical'
};

type CreateScopeProps = {
  cells: HTMLElement[],
  container: HTMLElement,
  initialScope: Scope,
}

export const createScope = ({
  cells,
  container,
  initialScope
}: CreateScopeProps) => {
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