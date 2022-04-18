import type { CellStateBlank } from './blank.js';
import type { CellStateClock } from './clock.js';
import type { CellStateImage } from './image.js';
import type { CellStateText } from './text.js';
import type { CellStateWeb } from './web.js';
import type { JsonSchemaProperty } from './_schema.js';

interface CellStateMap {
	BLANK: CellStateBlank;
	TEXT: CellStateText;
	IMAGE: CellStateImage;
	WEB: CellStateWeb;
	CLOCK: CellStateClock;
}

export type CellState = CellStateMap[keyof CellStateMap];
export type CellStateType = CellState['type'];

const types: readonly CellStateType[] = ['BLANK', 'TEXT', 'IMAGE', 'WEB', 'CLOCK'];
export const cellStateTypes: ReadonlySet<CellStateType> = new Set(types);

export * from './blank.js';
export * from './clock.js';
export * from './image.js';
export * from './text.js';
export * from './web.js';
export type { JsonSchemaProperty };

export function filterState<Type extends CellStateType>(
	type: Type,
	state: CellState
): CellStateMap[Type] | undefined {
	if (state.type === type) {
		return state as CellStateMap[Type];
	} else {
		return undefined;
	}
}

export interface CellStateJsonSchema {
	type: 'object';
	properties: {
		type: JsonSchemaProperty & {
			type: 'string';
			const: CellState['type'];
		};
		[prop: string]: JsonSchemaProperty;
	};
	required: readonly string[];
}

export function getTypeFromSchema(schema: CellStateJsonSchema): CellStateType {
	return schema.properties.type.const;
}
