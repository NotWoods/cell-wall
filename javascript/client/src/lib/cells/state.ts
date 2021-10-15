export enum CellStateType {
	BLANK = 'BLANK',
	CONFIGURE = 'CONFIGURE',
	TEXT = 'TEXT',
	IMAGE = 'IMAGE',
	BUTTON = 'BUTTON',
	WEB = 'WEB'
}

export interface CellStateBlank {
	type: CellStateType.BLANK;
}

export interface CellStateText {
	type: CellStateType.TEXT;
	text: string;
	backgroundColor?: string;
}

export interface CellStateImage {
	type: CellStateType.IMAGE;
	src: string;
	scaleType?: string;
}

export interface CellStateWeb {
	type: CellStateType.WEB;
	url: string;
}

export type CellState = CellStateBlank | CellStateText | CellStateImage | CellStateWeb;

export function blankState(): CellStateBlank {
	return { type: CellStateType.BLANK };
}
