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
    [key: string]: any;
  }>;

  type IntrinsicElementMap = {
    [K in keyof HTMLElementTagNameMap]: Attributes;
  };

  type Tag = keyof JSX.IntrinsicElements;
}
