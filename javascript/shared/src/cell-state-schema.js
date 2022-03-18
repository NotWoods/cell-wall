function buildCellState(options) {
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
    };
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
export const allCellStateSchemas = [
    cellStateBlankSchema,
    cellStateImageSchema,
    cellStateTextSchema,
    cellStateWebSchema
];
export function getTypeFromSchema(schema) {
    return schema.properties.type.enum[0];
}
//# sourceMappingURL=cell-state-schema.js.map