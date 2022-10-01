const nodeRefs = new WeakMap<Node, () => void>();

const mutationObserver = new MutationObserver((mutationList) => {
  for (const mutation of mutationList) {
    mutation.removedNodes.forEach(removedNode => {
      if (nodeRefs.has(removedNode)) {
        nodeRefs.get(removedNode)();
        nodeRefs.delete(removedNode);
      }
    })
  }
});

mutationObserver.observe(document.body, { subtree: true, childList: true });

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
  let hasRef;

  if (attributes) {
    for (let key in attributes) {
      const attribute = attributes[key];
  
      if (key === 'ref') {
        hasRef = true;
      } else if (typeof attribute === 'string') {
        el.setAttribute(key, attribute);
      } else {
        el[key] = attribute;
      }
    }
  }

  children.forEach((c) => {
    el.appendChild(c instanceof HTMLElement ? c : new Text(c));
  });

  if (hasRef){
    const cleanup = (attributes.ref as Function)(el);
    if (cleanup) {
      nodeRefs.set(el, cleanup);
    }
  }

  return el;
};

