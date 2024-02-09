import * as v from 'valibot';

export const CellInfoSchema = v.object({
	serial: v.string(),
	deviceName: v.optional(v.string()),
	width: v.optional(v.number([v.minValue(0)])),
	height: v.optional(v.number([v.minValue(0)])),
	x: v.optional(v.number()),
	y: v.optional(v.number()),
	server: v.optional(v.string([v.url()]))
});

/**
 * Cell info includes the user-friendly name of a device,
 * the width and height of the display in density independent pixels,
 * and the x/y location relative to other phones.
 */
export type CellInfo = v.Input<typeof CellInfoSchema>;
