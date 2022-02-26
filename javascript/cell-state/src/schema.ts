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
		url: { type: 'string', format: 'uri' }
	},
	required: ['url']
});
export const cellStateTextSchema = buildCellState({
	type: 'TEXT',
	properties: {
		text: { type: 'string' },
		backgroundColor: { type: 'string' }
	},
	required: ['text']
});
export const cellStateImageSchema = buildCellState({
	type: 'IMAGE',
	properties: {
		src: { type: 'string', format: 'uri' },
		scaleType: {
			type: 'string',
			enum: ['FIT_CENTER', 'FIT_XY', 'CENTER_INSIDE']
		}
	},
	required: ['src']
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
			enum: readonly [string];
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
