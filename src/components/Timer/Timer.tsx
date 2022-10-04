import { getContext } from '@/game/context';

import './Timer.css';

type Props = {
  className: string;
}

export const Timer = ({ className }: Props) => {
  const { eventBus, settings } = getContext();
  let { duration } = settings.timerSettings;

  const getTimeText = (value: number) => {
    let sec = Math.max(0, Math.round(value / 100) / 10).toString();

    if (!sec.includes('.')) {
      sec += '.0';
    }
    return sec;
  };

  const time = <div class="timer__time">{getTimeText(duration)}</div>;
  const animation = <div class="timer__animation" style={`--timer-duration:${duration}ms`} />;

  const handleTimer = () => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    let intervalRef;

    const stopTimer = () => {
      clearInterval(intervalRef);
      animation.style.animationPlayState = 'paused';
    };

    const startTime = () => {
      const intervalMs = 100;
      animation.style.animationPlayState = 'running';

      intervalRef = setInterval(() => {
        duration -= intervalMs;
        time.textContent = getTimeText(duration);

        if (duration === 0) {
          stopTimer();
          // eventBus.dispatchEvent(new CustomEvent('game-end', { detail: 'timer' }));
        }
      }, intervalMs);
    };

    /** A user selected any cell. The timer starts. */
    eventBus.addEventListener('cell-select', startTime, { signal, once: true });
    eventBus.addEventListener('game-end', () => {  
      eventBus.dispatchEvent(new CustomEvent('timer-status', { detail: duration }));

      stopTimer();
      abortController.abort();
     }, { signal, once: true });

    return () => {
      stopTimer();
      abortController.abort();
    }
  }

  return (
    <div 
      class={`${className} timer`}
      ref={handleTimer}
    >
      <div>Breach time remaining</div>
      {time}
      {animation}
    </div>
  );
}