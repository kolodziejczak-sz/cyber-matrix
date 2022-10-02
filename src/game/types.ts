export type Matrix = {
  rowLength: number;
  symbols: string[],
};

export type Direction = 'row' | 'column';

export type Scope = ScopeSettings;

export type Buffor = string[];

export type Sequences = {
  easy: string[],
  medium: string[],
  hard: string[],
};

export type ScopeSettings = {
  index: number,
  direction: Direction,
};

export type TimerSettings = {
  duration: number
};

export type MatrixSettings = { rowLength: number };

export type BufforSettings = { length: number };

export type SequenceSettings = { length: number, points: number };

export type SequencesSettings = {
  easy: SequenceSettings,
  medium: SequenceSettings,
  hard: SequenceSettings,
};

export type GameSettings = {
  scopeSettings: ScopeSettings;
  matrixSettings: MatrixSettings;
  sequencesSettings: SequencesSettings;
  bufforSettings: BufforSettings,
  timerSettings: TimerSettings;
};

export type Context = {
  matrix: Matrix,
  sequences: Sequences,
  buffor: Buffor,
  eventBus: EventTarget,
  settings: GameSettings,
};
