export interface CellStateText {
	type: 'TEXT';
	payload: string;
	backgroundColor?: string;
}

export function textState(text: string, backgroundColor?: string): CellStateText {
	return { type: 'TEXT', payload: text, backgroundColor };
}
