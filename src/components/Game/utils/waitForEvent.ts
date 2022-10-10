export const waitForEvent = <TEvent extends Event>(source: EventTarget, name: string) => {
  return new Promise<TEvent>((resolve) => {
    source.addEventListener(name, (event: TEvent) => {
      resolve(event);
    }, { once: true })
  });
};
