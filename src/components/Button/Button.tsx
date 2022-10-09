import './Button.css';

type ButtonProps = {
  className?: string;
  text: string;
  onClick: () => void;
};

export const Button = ({ className, onClick, text }: ButtonProps) => {
  const button = (
    <button class={`${className} button cut-bottom-border`}>{text}</button>
  );
  button.onclick = onClick;

  return button;
};