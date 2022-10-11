import './Menu.css';

type Props = {
  onStart: () => void;
};

export const Menu = ({ onStart }: Props) => {
  const howToPlayLink = (
    'https://www.polygon.com/cyberpunk-2077-guide-walkthrough/22163900/breach-protocol-encrypted-shard-militech-datashard-access-point-quickhack-buffer#Hxb12y'
  );

  return (
    <div class="menu">
        <header class="menu__header">
          <h1 class="menu__title">Cyber matrix</h1>
          <p class="menu__subtitle">The "Breach protocol" Mini Game from Cyberpunk 2077 ported to web</p>
        </header>
        <main class="menu__options">
          <button
            class="menu__option cut-bottom-border"
            onclick={onStart}
          >
            Start
          </button>
          <a
            href={howToPlayLink}
            class="menu__option menu__option--secondary cut-bottom-border"
            target="_blank"
          >
            How to play &#8599;
          </a>
        </main>
    </div>
  )
}