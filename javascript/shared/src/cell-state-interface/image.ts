import { buildSchema } from './_schema';

export interface CellStateImage {
	readonly type: 'IMAGE';
	readonly payload: string | ArrayBuffer | Blob;
	readonly scaleType?: 'FIT_CENTER' | 'FIT_XY' | 'CENTER_INSIDE';
}

export const cellStateImageSchema = buildSchema<CellStateImage>({
	type: 'IMAGE',
	properties: {
		payload: { type: 'string', title: 'Source', format: 'uri' },
		scaleType: {
			type: 'string',
			enum: ['FIT_CENTER', 'FIT_XY', 'CENTER_INSIDE']
		}
	},
	required: ['payload']
});
