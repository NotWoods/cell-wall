import { buildSchema } from './_schema';

export interface CellStateClock {
	type: 'CLOCK';
	/** Time Zone */
	payload: string;
}

export const cellStateClockSchema = buildSchema<CellStateClock>({
	type: 'CLOCK',
	properties: {
		payload: { type: 'string', title: 'Time Zone' }
	},
	required: ['payload']
});
