export type Matrix = {
  symbols: string[];
  rowLength: number;
};

export type CellData = {
  symbol: string;
  row: number;
  column: number;
  disabled?: string;
}

export type Direction = 'row' | 'column';

export type Scope = ScopeSettings;

export type GameEndData = {
  reason: string;
  sequences: (Sequence & { succeed: boolean; })[];
}

export type Sequence = {
  length: number;
  points: number;
  symbols: string[];
  name: string;
}

export type Sequences = Sequence[];

export type ScopeSettings = {
  direction: Direction;
  index: number;
};

export type TimerSettings = {
  duration: number;
};

export type MatrixSettings = { rowLength: number };

export type BufferSettings = { length: number };

export type SequenceSettings = { length: number; points: number, name: string };

export type SequencesSettings = SequenceSettings[];

export type ControllerSettings = 'mouse' | 'touch'

export type GameSettings = {
  bufferSettings: BufferSettings;
  controllerSettings: ControllerSettings;
  matrixSettings: MatrixSettings;
  scopeSettings: ScopeSettings;
  sequencesSettings: SequencesSettings;
  timerSettings: TimerSettings;
};

export type GameData = {
  eventBus: EventTarget;
  matrix: Matrix;
  sequences: Sequences;
  settings: GameSettings;
};
