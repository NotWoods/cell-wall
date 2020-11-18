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

export type CellState =
  | CellStateBlank
  | CellStateText
  | CellStateImage
  | CellStateWeb;

export function toUri(state: CellState, base?: string | URL) {
  const { type, ...props } = state;
  switch (type.toUpperCase()) {
    case CellStateType.WEB: {
      const web = props as CellStateWeb;
      return new URL(web.url, base).toString();
    }
    case CellStateType.IMAGE: {
      const imgProps = props as CellStateImage;
      imgProps.src = new URL(imgProps.src, base).toString();
      // fall through
    }
    default:
      return `cellwall://${type}?${stringify(props as Record<string, string>)}`;
  }
}
