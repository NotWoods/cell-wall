import { buildSchema } from './_schema';

export interface CellStateWeb {
	readonly type: 'WEB';
	readonly payload: string;
}

export function webState(url: string): CellStateWeb {
	return { type: 'WEB', payload: url };
}

export const cellStateWebSchema = buildSchema<CellStateWeb>({
	type: 'WEB',
	properties: {
		payload: { type: 'string', title: 'URL', format: 'uri' }
	},
	required: ['payload']
});
