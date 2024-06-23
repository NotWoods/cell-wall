import * as v from 'valibot';

export const CellStateClockSchema = v.object({
	type: v.literal('CLOCK'),
	/** Time Zone */
	payload: v.optional(v.string())
});

export type CellStateClock = Readonly<v.InferInput<typeof CellStateClockSchema>>;
