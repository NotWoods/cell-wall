export interface CellStateText {
	type: 'TEXT';
	/** Can also send ArrayBuffer to update text */
	text: string;
	backgroundColor?: string;
}

export function textState(text: string, backgroundColor?: string): CellStateText {
	return { type: 'TEXT', text, backgroundColor };
}
