import type { ReadonlyDeep } from 'type-fest';
import * as v from 'valibot';
import { CellInfoSchema } from './cell-info.js';
import { CellStateSchema } from './cell-state/index.js';

export type ConnectionType = 'web' | 'android';

export const CellDataSchema = v.object({
	info: v.optional(CellInfoSchema),
	state: CellStateSchema,
	connection: v.array(v.picklist(['web', 'android']))
});

/**
 * Contains all the information related to a Cell,
 * including state, static info, and connection status.
 */
export type CellData = ReadonlyDeep<v.InferInput<typeof CellDataSchema>>;
