import { getContext } from '@/game/context';
import './Sequences.css';

type Props = {
  className: string;
}

export const Sequences = ({ className }: Props) => {
  const { sequences } = getContext();

  return (
    <div class={`sequences ${className}`}>
      Hello sequences
    </div>
  )
}