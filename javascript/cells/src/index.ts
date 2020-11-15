import { readFile, writeFile } from 'fs/promises';
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

export class CellManager extends EventEmitter {
  private cells = new Map<string, CellData>();

  constructor(private readonly path: string) {
    super();
  }

  async loadData() {
    try {
      const json = JSON.parse(await readFile(this.path, 'utf8'));
      if (typeof json === 'object' && json != null && !Array.isArray(json)) {
        this.cells = new Map(
          Object.entries(json).map(([key, info]) => [
            key,
            {
              serial: key,
              info: info as CellInfo,
              state: { type: CellStateType.BLANK },
            },
          ]),
        );
      }
    } catch (err) {
      // do nothing, just use blank data
    }
  }

  async saveData() {
    await writeFile(
      this.path,
      JSON.stringify(Object.fromEntries(this.cells)),
      'utf8',
    );
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

  values() {
    return this.cells.values();
  }
}
