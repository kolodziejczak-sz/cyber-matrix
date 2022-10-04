import { Matrix } from '@/components/Matrix';
import { Sequences } from '@/components/Sequences';
import { Timer } from '@/components/Timer';

import './App.css';

export const App = () => {
  return (
    <div class="app">
      <Timer className="app__timer" />
      <Matrix className="app__matrix" />
      <Sequences className="app__sequences" />
    </div>
  )
}