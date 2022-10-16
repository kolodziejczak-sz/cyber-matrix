export type CellData = {
  symbol: Symbol;
  row: number;
  column: number;
  disabled?: string;
};

export type Controller = 'mouse' | 'touch';

export type Direction = 'row' | 'column';

export type Symbol = string;

export type Symbols = Symbol[];

export type Matrix = {
  symbols: Symbols;
  rowLength: number;
};

export type Scope = {
  direction: Direction;
  index: number;
};

export type Sequence = {
  length: number;
  points: number;
  symbols: Symbols;
  name: string;
};

export type Sequences = Sequence[];

export type GameData = {
  bufferLength: number;
  controller: Controller;
  eventBus: EventTarget;
  initialScope: Scope;
  matrix: Matrix;
  sequences: Sequences;
  timerDuration: number;
};

export type GameEndData = {
  sequences: (Sequence & { succeed: boolean; })[];
  reason: string;
};
