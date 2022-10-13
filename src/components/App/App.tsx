import './App.css';

import { Game } from '@/components/Game';
import { Menu } from '@/components/Menu';

export const App = () => {
  const routes = {
    '#': () => (
      <Menu onStart={startGame} />
    ),
    '#game': () => (
      <Game
        onExit={goToMenu}
        onPlayAgain={startGame}
      />
    ),
  };

  const goToMenu = () => goTo('#');
  const startGame = () => goTo('#game');

  const goTo = (hash: string) => {
    if (location.hash === hash) {
      handleHashChange();
    } else {
      location.hash = hash;
    }
  };

  const root = <div class="app" />;

  const render = (element: HTMLElement) => {
    root.replaceChildren(element);
  };

  const handleHashChange = () => {
    const hash = location.hash;
    const route = routes[hash] || routes['#'];

    render(route());
  };

  window.addEventListener('hashchange', handleHashChange);

  handleHashChange();

  return root;
}