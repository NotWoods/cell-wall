import { buildSchema } from './_schema.js';
export const cellStateBusySchema = buildSchema({
    type: 'BUSY',
    properties: {
        payload: {
            type: 'string',
            title: 'Calendar ID',
            examples: ['tigeroakes@gmail.com', 'daphne.liu97@gmail.com']
        }
    },
    required: ['payload']
});
//# sourceMappingURL=busy.js.map