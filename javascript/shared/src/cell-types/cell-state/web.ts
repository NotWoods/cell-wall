import * as v from 'valibot';

export const CellStateWebSchema = v.object({
	type: v.literal('WEB'),
	/** UR: */
	payload: v.pipe(v.string(), v.url())
});

export type CellStateWeb = Readonly<v.InferInput<typeof CellStateWebSchema>>;

export function webState(url: string): CellStateWeb {
	return { type: 'WEB', payload: url };
}
