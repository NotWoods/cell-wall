import { CellState } from '@cell-wall/cells';
import calendars from './calendars.js';
import info from './info.js';
import tea from './tea.js';

export type Preset = Partial<Record<string, CellState>>;

export const presets = {
  info: info as Preset,
  tea: tea as Preset,
};

export { calendars };
