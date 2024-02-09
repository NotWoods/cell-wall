import * as v from 'valibot';

export const CellStateTextSchema = v.object({
	type: v.literal('TEXT'),
	/** Text */
	payload: v.string(),
	backgroundColor: v.optional(v.string())
});

export type CellStateText = Readonly<v.Input<typeof CellStateTextSchema>>;

export function textState(text: string, backgroundColor?: string): CellStateText {
	return { type: 'TEXT', payload: text, backgroundColor };
}
