import { buildSchema } from './_schema.js';

export interface CellStateBusy {
	type: 'BUSY';
	/** Calendar ID */
	payload: string;
}

export const cellStateBusySchema = buildSchema<CellStateBusy>({
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
