import { buildSchema } from './_schema';

export interface CellStateText {
	readonly type: 'TEXT';
	readonly payload: string;
	readonly backgroundColor?: string;
}

export function textState(text: string, backgroundColor?: string): CellStateText {
	return { type: 'TEXT', payload: text, backgroundColor };
}

export const cellStateTextSchema = buildSchema<CellStateText>({
	type: 'TEXT',
	properties: {
		payload: { type: 'string', title: 'Text' },
		backgroundColor: { type: 'string' }
	},
	required: ['payload']
});
