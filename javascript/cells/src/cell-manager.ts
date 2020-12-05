import { readFile } from 'fs/promises';
import { EventEmitter } from 'events';
import { CellInfo } from './cell-info.js';
import { CellState, CellStateType } from './cell-state.js';

export interface CellData {
  serial: string;
  info: CellInfo;
  state: CellState;
}

export class CellManager extends EventEmitter {
  private cells = new Map<string, CellData>();

  constructor(private readonly path: string) {
    super();
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

  entries() {
    return this.cells.entries();
  }

  keys() {
    return this.cells.keys();
  }

  values() {
    return this.cells.values();
  }
}
