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
        <header>
          <h1 class="menu__title">Cyber Matrix</h1>
          <p class="menu__subtitle">The "Breach protocol" Mini Game from Cyberpunk 2077 ported to web</p>
        </header>
        <main class="menu__options">
          <button
            class="option cut-bottom-corner"
            onclick={onStart}
          >
            Start
          </button>
          <a
            href={howToPlayLink}
            class="option option--secondary cut-bottom-corner"
            target="_blank"
          >
            How to play &#8599;
          </a>
        </main>
        <footer class="menu__footer">
          <p>
            Game controls
            <ul>
              <li>Desktop: hover the cursor to select a cell, click to confirm the selection,</li>
              <li>Mobile: tap to select a cell, double tap to confirm the selection</li>
            </ul>
          </p>
          <p>
            Copyright (c) 2022, snkj.
            Feel free to submit any issue/feature request
            on <a href="https://github.com/kolodziejczak-sz/cyber-matrix/">GitHub &#8599;</a>
          </p>
        </footer>
    </div>
  )
}