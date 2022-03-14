import type { CellState } from './interface';

type Keys<T> = keyof T extends never ? string : keyof T;

function buildCellState<Type extends string, Props>(options: {
	type: Type;
	properties?: Props;
	required?: readonly Keys<Props>[];
}) {
	const { type, properties = {}, required = [] } = options;
	return {
		type: 'object',
		properties: {
			type: {
				type: 'string',
				enum: [type]
			},
			...properties
		},
		required: ['type', ...required]
	} as const;
}

export const cellStateBlankSchema = buildCellState({ type: 'BLANK' });
export const cellStateWebSchema = buildCellState({
	type: 'WEB',
	properties: {
		payload: { type: 'string', format: 'uri' }
	},
	required: ['payload']
});
export const cellStateTextSchema = buildCellState({
	type: 'TEXT',
	properties: {
		payload: { type: 'string' },
		backgroundColor: { type: 'string' }
	},
	required: ['payload']
});
export const cellStateImageSchema = buildCellState({
	type: 'IMAGE',
	properties: {
		payload: { type: 'string', format: 'uri' },
		scaleType: {
			type: 'string',
			enum: ['FIT_CENTER', 'FIT_XY', 'CENTER_INSIDE']
		}
	},
	required: ['payload']
});
export const cellStateSchema = {
	type: 'object',
	properties: {
		type: { type: 'string', enum: ['BLANK', 'WEB', 'TEXT', 'IMAGE'] }
	},
	additionalProperties: true,
	required: ['type']
};

export interface CellStateJsonSchema {
	type: 'object';
	properties: {
		type: {
			type: 'string';
			enum: readonly [CellState['type']];
		};
		[prop: string]: {
			type: string;
			enum?: readonly string[];
		};
	};
	required: readonly string[];
}

export const allCellStateSchemas = [
	cellStateBlankSchema,
	cellStateImageSchema,
	cellStateTextSchema,
	cellStateWebSchema
] as const;

export function getTypeFromSchema(schema: CellStateJsonSchema): string {
	return schema.properties.type.enum[0];
}
