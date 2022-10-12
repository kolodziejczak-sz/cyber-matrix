import './App.css';

import { Game } from '@/components/Game';
import { Menu } from '@/components/Menu';
import { Score } from '@/components/Score';
import { GameEndData } from '@/components/Game/types';
import { defer } from '@/components/Game/utils/defer';

export const App = () => {
  let view: HTMLElement;

  const changeView = (element: HTMLElement) => {
    view.replaceWith(element);
    view = element;
  }

  const goToMenu = () => changeView(menu);

  const startGame = () => changeView(<Game onEnd={handleGameEnd} />);

  const handleGameEnd = (data: GameEndData) => {
    const { reason } = data;

    if (reason === 'exit') return goToMenu();
    
    const scoreBoardModal = (
      <Score
        gameEndData={data}
        onMainMenu={goToMenu}
        onPlayAgain={startGame}
      />
    );

    defer(() => changeView(scoreBoardModal), 600);
  };

  const menu = view = <Menu onStart={startGame} />;

  startGame();

  return view;
}