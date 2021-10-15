import { SERVER_ADDRESS } from '../env';

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

export function textState(text: string, backgroundColor?: string): CellStateText {
	return { type: CellStateType.TEXT, text, backgroundColor };
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

export function toUri(state: CellState, base: string | URL = SERVER_ADDRESS): URL {
	const { type, ...props } = state;
	switch (type.toUpperCase()) {
		case CellStateType.WEB: {
			const web = props as CellStateWeb;
			return new URL(web.url, base);
		}
		case CellStateType.IMAGE: {
			const imgProps = props as CellStateImage;
			imgProps.src = new URL(imgProps.src, base).toString();
			// fall through
		}
		default: {
			const url = new URL(`cellwall://${type}`);
			for (const [key, value] of Object.entries(props)) {
				url.searchParams.append(key, value);
			}
			return url;
		}
	}
}
