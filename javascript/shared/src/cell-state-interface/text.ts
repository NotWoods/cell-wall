export interface CellStateText {
	readonly type: 'TEXT';
	readonly payload: string;
	readonly backgroundColor?: string;
}

export function textState(text: string, backgroundColor?: string): CellStateText {
	return { type: 'TEXT', payload: text, backgroundColor };
}
