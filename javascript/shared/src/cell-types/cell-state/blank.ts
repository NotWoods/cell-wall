import * as v from 'valibot';

export const CellStateBlankSchema = v.object({
	type: v.literal('BLANK'),
	payload: v.optional(v.literal(''))
});

export type CellStateBlank = Readonly<v.Input<typeof CellStateBlankSchema>>;

export const blankBuffer = new ArrayBuffer(0);

export const blankState: CellStateBlank = Object.freeze({ type: 'BLANK', payload: '' });
