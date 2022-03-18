export interface CellStateBlank {
	readonly type: 'BLANK';
	readonly payload?: '';
}

export const blankBuffer = new ArrayBuffer(0);

export const blankState: CellStateBlank = Object.freeze({ type: 'BLANK', payload: '' });
