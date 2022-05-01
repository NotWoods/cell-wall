/**
 * Helper to build a JSON schema object for a cell state.
 */
export function buildSchema(options) {
    const { type, properties = {}, required = [] } = options;
    return {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                const: type
            },
            ...properties
        },
        required: ['type', ...required]
    };
}
//# sourceMappingURL=_schema.js.map