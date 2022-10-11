import './App.css';

import { Game } from '@/components/Game';
import { Menu } from '@/components/Menu';


export const App = () => {
  let view: HTMLElement;

  const changeView = (element: HTMLElement) => {
    view.replaceWith(element);
    view = element;
  }

  const backToMenu = () => {
    changeView(menu);
  };

  const startGame = () => {
    changeView(<Game onEnd={backToMenu} />);
  }

  const menu = view = <Menu onStart={startGame} />;

  return view;
}