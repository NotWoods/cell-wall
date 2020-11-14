import { CellState } from '@cell-wall/cells';
import calendars from './calendars.json';
import info from './info.json';
import tea from './tea.json';

export type Preset = Partial<Record<string, CellState>>;

export const presets = {
  info: info as Preset,
  tea: tea as Preset,
};

export { calendars };
