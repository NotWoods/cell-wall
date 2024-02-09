import * as v from 'valibot';

export const CellStateBusySchema = v.object({
	type: v.literal('BUSY'),
	/**
	 * Calendar ID
	 * i.e. the email address of the calendar owner, tigeroakes@gmail.com
	 */
	payload: v.string()
});

export type CellStateBusy = Readonly<v.Input<typeof CellStateBusySchema>>;
