import { readFile } from 'fs/promises';
import { EventEmitter } from 'events';
import { CellInfo } from './cell-info';
import { CellState, CellStateType } from './cell-state';

export * from './cell-info';
export * from './cell-state';
export * from './schema';

export interface CellData {
  serial: string;
  info: CellInfo;
  state: CellState;
}

const AXIS_TO_POS = {
  width: 'x',
  height: 'y',
} as const;

export class CellManager extends EventEmitter {
  private cells = new Map<string, CellData>();

  private canvas = { width: 0, height: 0 };

  constructor(private readonly path: string) {
    super();
  }

  get canvasHeight() {
    return this.canvas.height;
  }

  get canvasWidth() {
    return this.canvas.width;
  }

  private updateCanvas(info: CellInfo, axis: 'width' | 'height') {
    const pos = AXIS_TO_POS[axis];
    this.canvas[axis] = Math.max(this.canvas[axis], info[pos] + info[axis]);
  }

  async loadData() {
    try {
      const json = JSON.parse(await readFile(this.path, 'utf8'));
      if (typeof json === 'object' && json != null && !Array.isArray(json)) {
        for (const [key, info] of Object.entries(json)) {
          this.register(key, info as CellInfo);
        }
      }
    } catch (err) {
      console.error('Could not load CellManager data', err);
      // do nothing, just use blank data
    }
  }
  get(serial: string) {
    return this.cells.get(serial);
  }

  register(serial: string, info: CellInfo) {
    const data: CellData = {
      serial,
      info,
      state: { type: CellStateType.BLANK },
    };
    this.cells.set(serial, data);

    this.updateCanvas(info, 'width');
    this.updateCanvas(info, 'height');

    this.emit('register', data);
    return data;
  }

  setState(serial: string, state: CellState) {
    let existing = this.cells.get(serial);
    if (!existing) {
      throw new Error(`Register ${serial} before setting its state.`);
    }
    const data: CellData = {
      serial,
      info: existing.info,
      state,
    };
    this.cells.set(serial, data);
    this.emit('state', data);
  }

  values() {
    return this.cells.values();
  }
}
