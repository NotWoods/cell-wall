import { buildSchema } from './_schema';
export function webState(url) {
    return { type: 'WEB', payload: url };
}
export const cellStateWebSchema = buildSchema({
    type: 'WEB',
    properties: {
        payload: { type: 'string', title: 'URL', format: 'uri' }
    },
    required: ['payload']
});
//# sourceMappingURL=web.js.map