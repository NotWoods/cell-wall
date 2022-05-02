import {
	cellStateBlankSchema,
	cellStateClockSchema,
	cellStateImageSchema,
	cellStateTextSchema,
	cellStateWebSchema,
	type CellStateType
} from './cell-state-interface/index.js';
import type {
	JsonSchemaProperty,
	ObjectJsonSchemaProperty
} from './cell-state-interface/_schema.js';

export interface CellStateJsonSchema extends ObjectJsonSchemaProperty {
	properties: {
		type: JsonSchemaProperty & {
			type: 'string';
			const: CellStateType;
		};
		[prop: string]: JsonSchemaProperty;
	};
}

export const allCellStateSchemas = [
	cellStateBlankSchema,
	cellStateClockSchema,
	cellStateImageSchema,
	cellStateTextSchema,
	cellStateWebSchema
] as const;
