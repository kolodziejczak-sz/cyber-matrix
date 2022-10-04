export const classListEffect = (className: string, target: HTMLElement | HTMLElement[]) => {
  if (Array.isArray(target)) {
    target.forEach(t => t.classList.add(className));

    return () => target.forEach(t => t.classList.remove(className));
  }

  target.classList.add(className);

  return () => target.classList.remove(className);
} 