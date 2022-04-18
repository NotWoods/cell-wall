import {
	cellStateBlankSchema,
	cellStateClockSchema,
	cellStateImageSchema,
	cellStateTextSchema,
	cellStateWebSchema,
	type CellState
} from './cell-state-interface';
import type { JsonSchemaProperty } from './cell-state-interface/_schema';

export interface CellStateJsonSchema {
	type: 'object';
	properties: {
		type: {
			type: 'string';
			enum: readonly [CellState['type']];
		};
		[prop: string]: JsonSchemaProperty;
	};
	required: readonly string[];
}

export const allCellStateSchemas = [
	cellStateBlankSchema,
	cellStateClockSchema,
	cellStateImageSchema,
	cellStateTextSchema,
	cellStateWebSchema
] as const;

export function getTypeFromSchema(schema: CellStateJsonSchema): string {
	return schema.properties.type.enum[0];
}
