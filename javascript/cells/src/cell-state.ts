import { stringify } from 'querystring';

export enum CellStateType {
  BLANK = 'BLANK',
  CONFIGURE = 'CONFIGURE',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  BUTTON = 'BUTTON',
  WEB = 'WEB',
}

export interface CellStateBlank {
  type: CellStateType.BLANK;
}

export interface CellStateText {
  type: CellStateType.TEXT;
  text: string;
  backgroundColor?: string;
}

export interface CellStateImage {
  type: CellStateType.IMAGE;
  src: string;
  scaleType?: string;
}

export interface CellStateWeb {
  type: CellStateType.WEB;
  url: string;
}

export type CellState = CellStateBlank | CellStateText | CellStateWeb;

export function toUri(state: CellState, base?: string | URL) {
  const { type, ...props } = state;
  if (type.toUpperCase() === CellStateType.WEB) {
    const web = props as CellStateWeb;
    return new URL(web.url, base).toString();
  } else {
    return `cellwall://${type}?${stringify(props as Record<string, string>)}`;
  }
}
