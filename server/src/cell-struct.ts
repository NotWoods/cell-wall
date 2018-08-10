export enum CellMode {
  BLANK = "BLANK",
  CONFIGURE = "CONFIGURE",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  BUTTON = "BUTTON"
}

export interface Cell {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: CellState;
}

export type CellState =
  | ReturnType<typeof blank>
  | ReturnType<typeof configure>
  | ReturnType<typeof text>
  | ReturnType<typeof image>
  | ReturnType<typeof button>;

/**
 * @param {string} id
 * @param {number} width
 * @param {number} height
 * @returns {Cell}
 */
export function createCell(id: string, width: number, height: number): Cell {
  return {
    id,
    width,
    height,
    x: 0,
    y: 0,
    state: blank()
  };
}

function createState<M extends CellMode, T>(mode: M, data: T) {
  return {
    mode,
    data
  };
}

export const blank = () => createState(CellMode.BLANK, {});

/**
 *
 * @param {string} backgroundColor
 * @param {string} icon
 */
export const configure = (backgroundColor: string, icon: string) =>
  createState(CellMode.CONFIGURE, { backgroundColor, icon });

/**
 * @param {string} text
 */
export const text = (text: string) => createState(CellMode.TEXT, { text });

/**
 *
 * @param {string} src
 */
export const image = (src: string) => createState(CellMode.IMAGE, { src });

export const button = () => createState(CellMode.BUTTON, {});
