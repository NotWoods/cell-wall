import { EventEmitter } from 'events';
import { CellInfo } from './cell-info';
import { CellState, CellStateType } from './cell-state';

export * from './cell-info';
export * from './cell-state';

export interface CellData {
  serial: string;
  info: CellInfo;
  state: CellState;
}

export class CellManager extends EventEmitter {
  private cells = new Map<string, CellData>();

  async loadData() {}

  async saveData() {}

  has(serial: string) {
    return this.cells.has(serial);
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
      // throw new Error(`Register ${serial} before setting its state.`);
      existing = this.register(serial, {});
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
