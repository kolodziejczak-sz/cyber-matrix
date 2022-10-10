import './Score.css';

type ScoreProps = {
  className: string;
  points: number;
};

export const Score = ({ className, points }: ScoreProps) => {
  
  return (
    <dialog
      class={`${className} score`}
    >
      <span>hello {points}</span>
    </dialog>
  );
}