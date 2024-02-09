import * as v from 'valibot';

export const CellStateImageSchema = v.object({
	type: v.literal('IMAGE'),
	/** Image source */
	payload: v.union([v.string([v.url()]), v.instance(ArrayBuffer)]),
	scaleType: v.optional(v.picklist(['FIT_CENTER', 'FIT_XY', 'CENTER_INSIDE']))
});

export type CellStateImage = Readonly<v.Input<typeof CellStateImageSchema>>;
