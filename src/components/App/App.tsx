import { Timer } from '@/components/Timer';
import { Buffer } from '@/components/Buffer';
import { Matrix } from '@/components/Matrix';
import { Sequences } from '@/components/Sequences';

import './App.css';

export const App = () => {
  return (
    <div class="app">
      <Timer className="app__timer" />
      <Buffer className="app__buffer" />
      <Matrix className="app__matrix" />
      <Sequences className="app__sequences" />
    </div>
  )
}