import { GameEndData } from '@/components/Game/types';
import './Score.css';

type Props = {
  gameEndData: GameEndData;
  onPlayAgain: () => void;
  onMainMenu: () => void;
};

export const Score = ({
  onMainMenu,
  onPlayAgain,
  gameEndData
}: Props) => {
  const { sequences, reason } = gameEndData;
  
  const totalPoints = sequences.reduce((sum, { points, succeed }) => {
    return sum + (succeed ? points : 0);
  }, 0);

  const totalPointsText = 'Total points';
  const retryText = `${totalPoints === 0 ? 'Try' : 'Play'} again`;
  const reasonText = {
    timer: 'Breach time ended',
    buffer: 'The buffer space exceeded',
    sequences: 'Sequences terminated',
    exit: 'Escaped'
  }[reason];

  const maxPrefixLengthForDots = Math.max(
    totalPointsText.length,
    retryText.length,
    ...sequences.map(({ length }) => length),
  );
  const maxSuffixLegthForDots = Math.max(
    ...sequences.map(({ points }) => points.toString().length),
  )

  const getDots = (length: number) => {
    return Array.from({ length }).map(() => '.').join('');
  }

  const getDottedText = (part1: string, part2: string) => {
    const minDotsLength = 5;
    const prefixDotsLength = maxPrefixLengthForDots - part1.length;
    const sufixDotsLength = maxSuffixLegthForDots - part2.length;
    const dotsLength = minDotsLength + prefixDotsLength + sufixDotsLength;

    return part1 + getDots(dotsLength) + part2;
  }

  return (
    <div class="score">
      <div class="console cut-top-corner">
        <div class="console__header">Console</div>
        <div class="console__body">
          <div
            class="console__line"
            style="--index:0;"
          >
            {reasonText}
          </div>
          {sequences.map(({ name, points, succeed }, index) => (
            <div
              class="console__line"
              style={`--index:${index + 1};`}
            >
              {getDottedText(name, (succeed ? points : 0).toString())}
            </div>
          ))}
          <div
            class="console__line"
            style={`--index:${sequences.length + 1};`}
          >
            {getDottedText(totalPointsText, totalPoints.toString())}
          </div>
        </div>
      </div>
      <div class="score__options">
          <button class="score__option option cut-bottom-corner" onclick={onPlayAgain}>
            {retryText}
          </button>
          <button class="score__option option option--secondary cut-bottom-corner" onclick={onMainMenu}>
            Main menu
          </button>
      </div>
    </div>
  );
};


  // const buggySequences = [
  //   { symbols: ['ac', 'ac', 'ac', 'ae'], length: 4, points: 300 },
  //   { symbols: ['ac', 'cc', 'cc', 'b6'], length: 4, points: 300 },
  //   { symbols: ['b6', 'ac', 'ac', 'ae'], length: 4, points: 300 },
  // ]
  
  // const buggyMatrix = {
  //   rowLength: 4,
  //   symbols: [
  //     'b6', 'ac', 'ac', 'cc',
  //     'ac', 'ac', 'ac', 'b6',
  //     'ae', 'cc', 'ac', 'cc',
  //     'cc', 'b6', 'ac', 'ae',
  //   ]
  // }