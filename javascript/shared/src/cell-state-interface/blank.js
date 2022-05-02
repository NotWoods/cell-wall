import { buildSchema } from './_schema.js';
export const blankBuffer = new ArrayBuffer(0);
export const blankState = Object.freeze({ type: 'BLANK', payload: '' });
export const cellStateBlankSchema = buildSchema({ type: 'BLANK' });
//# sourceMappingURL=blank.js.map