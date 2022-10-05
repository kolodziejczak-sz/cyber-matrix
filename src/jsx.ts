export const jsx = (
  tagName: Function | string,
  attributes: JSX.Attributes,
  ...rest: JSX.Children
): JSX.Element => {
  const children = rest.flat();

  const isComponent = typeof tagName === 'function';
  if (isComponent) {
    return tagName({ ...attributes, children });
  }

  const el = document.createElement(tagName);

  if (attributes) {
    for (let key in attributes) {
      const attribute = attributes[key];
      el.setAttribute(key, attribute);
    }
  }

  children.forEach((c) => {
    el.appendChild(c instanceof HTMLElement ? c : new Text(c));
  });

  return el;
};

