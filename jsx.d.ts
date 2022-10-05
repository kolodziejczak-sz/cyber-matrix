/*
 * @jsx jsx
 */
/// <reference lib="dom" />

declare namespace JSX {
  type Element = HTMLElement;
  type Child = HTMLElement | string;
  type Children = Child[];

  interface IntrinsicElements extends IntrinsicElementMap {}

  type Attributes = Partial<{
    class: string;
    style: string;
    [key: string]: string;
  }>;

  type IntrinsicElementMap = {
    [K in keyof HTMLElementTagNameMap]: Attributes;
  };

  type Tag = keyof JSX.IntrinsicElements;
}
