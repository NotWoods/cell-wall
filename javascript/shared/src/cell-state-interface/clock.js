import { buildSchema } from './_schema';
export const cellStateClockSchema = buildSchema({
    type: 'CLOCK',
    properties: {
        payload: { type: 'string', title: 'Time Zone' }
    },
    required: ['payload']
});
//# sourceMappingURL=clock.js.map