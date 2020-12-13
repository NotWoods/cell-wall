import { entries } from '@cell-wall/iterators';
import { CellInfo } from './cell-info.js';

const AXIS_TO_POS = {
  width: 'x',
  height: 'y',
} as const;

export interface CellCanvas {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function cellCanvas(cells: Iterable<Pick<CellInfo, keyof CellCanvas>>) {
  const canvas: CellCanvas = { x: Infinity, y: Infinity, width: 0, height: 0 };

  for (const info of cells) {
    for (const [axis, pos] of entries(AXIS_TO_POS)) {
      const value = info[pos] + info[axis];
      if (!Number.isNaN(value)) {
        canvas[pos] = Math.min(canvas[pos], info[pos]);
        canvas[axis] = Math.max(canvas[axis], info[pos] + info[axis]);
      }
    }
  }

  canvas.width = canvas.width - canvas.x;
  canvas.height = canvas.height - canvas.y;
  return canvas;
}

export function shiftCell<T extends Pick<CellInfo, 'x' | 'y'>>(
  canvas: CellCanvas,
  cell: T,
) {
  const copy = { ...cell };
  copy.x = cell.x - canvas.x;
  copy.y = cell.y - canvas.y;
  return copy;
}
