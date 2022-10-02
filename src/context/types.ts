export type Matrix = {
  rowLength: number;
  symbols: string[],
};

export type Buffor = string[];

export type Direction = 'row' | 'column';

export type Scope = {
  index: number,
  direction: Direction,
};

export type Sequences = {
  easy: string[],
  medium: string[],
  hard: string[],
};

export type Timer =  {
  duration: number
};

export type ScopeSettings = Scope;

export type TimerSettings = Timer;

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
}

export type Context = {
  eventBus: EventTarget,
  matrix: Matrix,
  sequences: Sequences,
  settings: GameSettings,
  buffor: Buffor,
};

