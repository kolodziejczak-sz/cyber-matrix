import './Exit.css';

type Props = {
  onClick: () => void;
};

export const Exit = ({ onClick }: Props) => {
  return (
    <button
      class="exit"
      onclick={onClick}
    >
      Esc
    </button>
  );;
};