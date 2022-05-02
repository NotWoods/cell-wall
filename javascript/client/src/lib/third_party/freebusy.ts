import type { Temporal } from '@js-temporal/polyfill';

export interface TimePeriod {
	/** The (inclusive) start of the time period. */
	start?: string | null;
	/** The (exclusive) end of the time period. */
	end?: string | null;
}

export interface FreeBusyRequest {
	/** List of calendars and/or groups to query. */
	items?: readonly {
		/** The identifier of a calendar or a group. */
		id?: string | null;
	}[];
	/** The end of the interval for the query formatted as per RFC3339. */
	timeMax?: string | null;
	/** The start of the interval for the query formatted as per RFC3339. */
	timeMin?: string | null;
}

export type FreeBusyResponse = readonly TimePeriod[];

export async function freeBusy(options: {
	timeMin: Temporal.ZonedDateTime;
	timeMax: Temporal.ZonedDateTime;
	items: FreeBusyRequest['items'];
}): Promise<Omit<Response, 'json'> & { json(): Promise<FreeBusyResponse> }> {
	const toStringOptions = {
		timeZoneName: 'never',
		smallestUnit: 'second'
	} as const;

	const request: FreeBusyRequest = {
		timeMin: options.timeMin.toString(toStringOptions),
		timeMax: options.timeMax.toString(toStringOptions),
		items: options.items
	};

	return await fetch('/api/third_party/freebusy', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(request)
	});
}
