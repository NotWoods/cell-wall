type JsonSchemaType<Type extends string | number | boolean | object> = Type extends string
	? 'string'
	: Type extends number
	? 'number'
	: Type extends boolean
	? 'boolean'
	: Type extends object
	? 'object'
	: never;

interface BaseJsonSchemaProperty<Type extends string | number | boolean | object> {
	type: JsonSchemaType<Type>;
	title?: string;
	enum?: readonly Type[];
	const?: Type;
}

interface StringJsonSchemaProperty extends BaseJsonSchemaProperty<string> {
	format?: string;
}

export type JsonSchemaProperty =
	| BaseJsonSchemaProperty<number | boolean | object>
	| StringJsonSchemaProperty;

/**
 * Helper to build a JSON schema object for a cell state.
 */
export function buildSchema<CellState extends { type: string }>(options: {
	type: CellState['type'];
	properties?: { [Key in Exclude<keyof CellState, 'type'>]: JsonSchemaProperty };
	required?: readonly (keyof CellState)[];
}) {
	const { type, properties = {}, required = [] } = options;
	return {
		type: 'object',
		properties: {
			type: {
				type: 'string',
				enum: [type],
				const: type
			},
			...properties
		},
		required: ['type', ...required]
	} as const;
}
