import { getContext } from '@/game/context';

import './Buffer.css';

type Props = {
  className: string;
}

export const Buffer = ({ className }: Props) => {
  const { eventBus, settings } = getContext();

  const handleBuffer = () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    eventBus.addEventListener('game-end', () => abortController.abort(), { signal, once: true });

    return () => {
      abortController.abort();
    }
  }

  return (
    <div 
      class={`${className} buffer`}
      ref={handleBuffer}
    >
      <div>Buffer</div>
    </div>
  );
}