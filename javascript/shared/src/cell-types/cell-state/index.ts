import * as v from 'valibot';
import { CellStateBlankSchema, type CellStateBlank } from './blank.js';
import { CellStateBusySchema, type CellStateBusy } from './busy.js';
import { CellStateClockSchema, type CellStateClock } from './clock.js';
import { CellStateImageSchema, type CellStateImage } from './image.js';
import { CellStateTextSchema, type CellStateText } from './text.js';
import { CellStateWebSchema, type CellStateWeb } from './web.js';

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

export const CellStateSchema = v.variant('type', [
	CellStateBlankSchema,
	CellStateBusySchema,
	CellStateClockSchema,
	CellStateImageSchema,
	CellStateTextSchema,
	CellStateWebSchema
]);

export * from './blank.js';
export * from './busy.js';
export * from './clock.js';
export * from './image.js';
export * from './text.js';
export * from './web.js';
