export type Matrix = {
  rowLength: number;
  symbols: string[],
};

export type Direction = 'row' | 'column';

export type Scope = ScopeSettings;

export type Buffer = string[];

export type Sequence = { length: number, points: number, symbols: string[] }

export type Sequences = Sequence[];

export type ScopeSettings = {
  index: number,
  direction: Direction,
};

export type TimerSettings = {
  duration: number
};

export type MatrixSettings = { rowLength: number };

export type BufferSettings = { length: number };

export type SequenceSettings = { length: number, points: number };

export type SequencesSettings = SequenceSettings[];

export type GameSettings = {
  scopeSettings: ScopeSettings;
  matrixSettings: MatrixSettings;
  sequencesSettings: SequencesSettings;
  bufferSettings: BufferSettings,
  timerSettings: TimerSettings;
};

export type Context = {
  matrix: Matrix,
  sequences: Sequences,
  buffer: Buffer,
  eventBus: EventTarget,
  settings: GameSettings,
};
