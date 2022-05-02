import type { CellStateBlank } from './blank.js';
import type { CellStateBusy } from './busy.js';
import type { CellStateClock } from './clock.js';
import type { CellStateImage } from './image.js';
import type { CellStateText } from './text.js';
import type { CellStateWeb } from './web.js';
import type { JsonSchemaProperty } from './_schema.js';

export interface CellStateMap {
	BLANK: CellStateBlank;
	TEXT: CellStateText;
	IMAGE: CellStateImage;
	WEB: CellStateWeb;
	CLOCK: CellStateClock;
	BUSY: CellStateBusy;
}

export type CellStateType = keyof CellStateMap;
export type CellState = CellStateMap[CellStateType];

export const cellStateTypes: ReadonlySet<CellStateType> = new Set([
	'BLANK',
	'TEXT',
	'IMAGE',
	'WEB',
	'CLOCK',
	'BUSY'
]);

export * from './blank.js';
export * from './busy.js';
export * from './clock.js';
export * from './image.js';
export * from './text.js';
export * from './web.js';
export type { JsonSchemaProperty };
