export interface CellStateBlank {
	type: 'BLANK';
	payload?: '';
}

export const blankBuffer = new ArrayBuffer(0);

export const blankState: CellStateBlank = Object.freeze({ type: 'BLANK', payload: '' });
