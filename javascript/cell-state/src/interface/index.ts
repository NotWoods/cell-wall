import type { CellStateBlank } from './blank';
import type { CellStateImage } from './image';
import type { CellStateText } from './text';
import type { CellStateWeb } from './web';

export type CellState = CellStateBlank | CellStateText | CellStateImage | CellStateWeb;

export const cellStateTypes: ReadonlySet<CellState['type']> = new Set([
	'BLANK',
	'TEXT',
	'IMAGE',
	'WEB'
]);

export * from './blank';
export * from './image';
export * from './text';
export * from './web';
