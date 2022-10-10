type ButtonProps = {
  className?: string;
  text: string;
  onClick: () => void;
};

export const Button = ({ className, onClick, text }: ButtonProps) => {
  const button = (
    <button class={className}>{text}</button>
  );
  button.onclick = onClick;

  return button;
};