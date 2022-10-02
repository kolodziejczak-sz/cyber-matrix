import { Matrix } from '@/components/Matrix';
import { Sequences } from '@/components/Sequences';

import './App.css';

export const App = () => {
  return (
    <div class="app">
      <Matrix className="app__matrix" />
      <Sequences className="app__sequences" />
    </div>
  )
}