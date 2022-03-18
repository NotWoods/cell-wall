export const cellInfoSchema = {
    type: 'object',
    properties: {
        serial: { type: 'string' },
        deviceName: { type: 'string' },
        width: { type: 'number', exclusiveMinimum: 0 },
        height: { type: 'number', exclusiveMinimum: 0 },
        x: { type: 'number' },
        y: { type: 'number' },
        server: { type: 'string', format: 'uri' }
    }
};
//# sourceMappingURL=cell-info.js.map