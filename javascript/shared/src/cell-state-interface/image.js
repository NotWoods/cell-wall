import { buildSchema } from './_schema';
export const cellStateImageSchema = buildSchema({
    type: 'IMAGE',
    properties: {
        payload: { type: 'string', title: 'Source', format: 'uri' },
        scaleType: {
            type: 'string',
            enum: ['FIT_CENTER', 'FIT_XY', 'CENTER_INSIDE']
        }
    },
    required: ['payload']
});
//# sourceMappingURL=image.js.map