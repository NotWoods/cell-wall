export interface CellStateBlank {
	type: 'BLANK';
}

export const blankBuffer = new ArrayBuffer(0);

export const blankState: CellStateBlank = Object.freeze({ type: 'BLANK' });
