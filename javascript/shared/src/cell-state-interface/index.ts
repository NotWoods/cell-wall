import type { CellStateBlank } from './blank.js';
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
}

export type CellStateType = keyof CellStateMap;
export type CellState = CellStateMap[CellStateType];

const types: readonly CellStateType[] = ['BLANK', 'TEXT', 'IMAGE', 'WEB', 'CLOCK'];
export const cellStateTypes: ReadonlySet<CellStateType> = new Set(types);

export * from './blank.js';
export * from './clock.js';
export * from './image.js';
export * from './text.js';
export * from './web.js';
export type { JsonSchemaProperty };
