import { buildSchema } from './_schema';
export function textState(text, backgroundColor) {
    return { type: 'TEXT', payload: text, backgroundColor };
}
export const cellStateTextSchema = buildSchema({
    type: 'TEXT',
    properties: {
        payload: { type: 'string', title: 'Text' },
        backgroundColor: { type: 'string' }
    },
    required: ['payload']
});
//# sourceMappingURL=text.js.map