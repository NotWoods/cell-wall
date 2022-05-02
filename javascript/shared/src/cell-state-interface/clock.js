import { buildSchema } from './_schema.js';
export const cellStateClockSchema = buildSchema({
    type: 'CLOCK',
    properties: {
        payload: { type: 'string', title: 'Time Zone' }
    }
});
//# sourceMappingURL=clock.js.map