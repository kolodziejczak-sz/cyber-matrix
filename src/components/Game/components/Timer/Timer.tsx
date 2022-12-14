import { getContext } from '@/components/Game/context';

import './Timer.css';

type Props = {
  className: string;
}

export const Timer = ({ className }: Props) => {
  const { eventBus, timerDuration } = getContext();

  let duration = timerDuration;

  const getTimeText = (value: number) => {
    let sec = Math.max(0, Math.round(value / 100) / 10).toString();

    if (!sec.includes('.')) sec += '.0';

    return sec;
  };

  const time = <div class="timer__time">{getTimeText(duration)}</div>;
  const animation = <div class="timer__animation" style={`--timer-duration:${duration}ms`} />;
  const view = (
    <div class={`${className} timer`}>
      <div>Breach time remaining</div>
      {time}
      {animation}
    </div>
  );

  let intervalRef;

  const stopTimer = () => {
    clearInterval(intervalRef);
    animation.style.animationPlayState = 'paused';
  };

  const startTimer = () => {
    const intervalMs = 100;
    animation.style.animationPlayState = 'running';

    intervalRef = setInterval(() => {
      duration -= intervalMs;
      time.textContent = getTimeText(duration);

      if (duration <= 0) {
        eventBus.dispatchEvent(new CustomEvent('game-end', { detail: 'time-out' }));
      }
    }, intervalMs);
  };

  const abortController = new AbortController();
  const signal = abortController.signal;

  /** A user selected any cell. The timer starts. */
  eventBus.addEventListener('cell-select', startTimer, { signal, once: true });
  eventBus.addEventListener('game-end', () => {  
    stopTimer();
    abortController.abort();
  }, { once: true });

  return view;
};