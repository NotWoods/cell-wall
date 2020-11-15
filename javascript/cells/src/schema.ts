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
        enum: [type],
      },
      ...properties,
    },
    required: ['type', ...required],
  } as const;
}

export const cellStateBlankSchema = buildCellState({ type: 'BLANK' });
export const cellStateWebSchema = buildCellState({
  type: 'WEB',
  properties: {
    url: { type: 'string' },
  },
  required: ['url'],
});
export const cellStateTextSchema = buildCellState({
  type: 'TEXT',
  properties: {
    text: { type: 'string' },
    backgroundColor: { type: 'string' },
  },
  required: ['text'],
});
export const cellStateImageSchema = buildCellState({
  type: 'IMAGE',
  properties: {
    src: { type: 'string' },
    scaleType: { type: 'string' },
  },
  required: ['src'],
});

export const cellStateSchema = {
  oneOf: [
    cellStateBlankSchema,
    cellStateWebSchema,
    cellStateTextSchema,
    cellStateImageSchema,
  ],
};

export interface CellStateJsonSchema {
  type: 'object';
  properties: {
    type: {
      type: 'string';
      enum: readonly [string];
    };
  };
}

export function getTypeFromSchema(schema: CellStateJsonSchema) {
  return schema.properties.type.enum[0];
}
