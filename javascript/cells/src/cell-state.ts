export enum CellStateType {
  BLANK = 'BLANK',
  CONFIGURE = 'CONFIGURE',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  BUTTON = 'BUTTON',
}

export interface CellStateBlank {
  type: CellStateType.BLANK;
}

export interface CellStateText {
  type: CellStateType.TEXT;
  text: string;
  background: number;
}

export type CellState = CellStateBlank | CellStateText;
