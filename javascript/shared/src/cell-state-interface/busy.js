import { buildSchema } from './_schema.js';
export const cellStateBusySchema = buildSchema({
    type: 'BUSY',
    properties: {
        payload: { type: 'string', title: 'Calendar ID' }
    },
    required: ['payload']
});
//# sourceMappingURL=busy.js.map