import { freeBusy, type TimePeriod } from '$lib/third_party/freebusy';
import { Temporal } from '@js-temporal/polyfill';
import { readable, type Unsubscriber } from 'svelte/store';

export interface BusyState {
	busy: boolean;
	next?: Temporal.ZonedDateTime;
}

async function fetchFreeBusy(calendarId: string, signal?: AbortSignal) {
	const today = Temporal.Now.zonedDateTimeISO('UTC').startOfDay();
	const response = await freeBusy({
		timeMin: today,
		timeMax: today.add({ days: 5 }),
		items: [{ id: calendarId }],
		signal
	});

	if (!response.ok) {
		throw new Error(`Could not load calendar, ${response.statusText}`);
	}

	return await response.json();
}

/**
 * @param ranges List of time ranges
 * @return Store that is true when the current time is in the busy range
 */
function isBusyInterval(ranges: readonly TimePeriod[]) {
	const dateTimeRanges = ranges.map(function convert(range: TimePeriod) {
		function fromTimeStamp(timestamp: string | Temporal.Instant | null | undefined) {
			if (timestamp) {
				return Temporal.Instant.from(timestamp).toZonedDateTimeISO('UTC');
			} else {
				return undefined;
			}
		}

		return {
			start: fromTimeStamp(range.start),
			end: fromTimeStamp(range.end)
		};
	});

	/**
	 * Check if the given time is within a time range
	 * @param time Date time stamp to check
	 */
	function isBusy(time: Temporal.ZonedDateTime): BusyState {
		for (const range of dateTimeRanges) {
			const { start, end } = range;

			if (start && Temporal.ZonedDateTime.compare(time, start) < 0) {
				// range is later, stop now because list is ordered
				return { busy: false, next: range.start };
			} else if (!end || Temporal.ZonedDateTime.compare(time, end) <= 0) {
				// this is the current range
				return { busy: true, next: range.end };
			} else {
				// range was sooner
				continue;
			}
		}
		return { busy: false };
	}

	return readable<BusyState>({ busy: false }, (set) => {
		let timeoutId: ReturnType<typeof setTimeout> | undefined;

		function checkBusy() {
			const now = Temporal.Now.zonedDateTimeISO('UTC');
			const { busy, next } = isBusy(now);
			set({ busy, next });

			if (next) {
				const duration = now.until(next);
				console.log(`Waiting until ${duration}`);

				const ms = duration.total({ unit: 'milliseconds' });
				setTimeout(checkBusy, Math.max(ms, 1000));
			}
		}
		checkBusy();

		return () => clearTimeout(timeoutId!);
	});
}

declare const self: Worker;

let unsubscribe: Unsubscriber | undefined;
self.addEventListener('message', async (event: MessageEvent<string | undefined>) => {
	const calendarId = event.data;
	if (calendarId) {
		try {
			const freeBusyRanges = await fetchFreeBusy(calendarId);
			const isBusy = isBusyInterval(freeBusyRanges);

			unsubscribe?.();
			unsubscribe = isBusy.subscribe(($isBusy) => {
				self.postMessage({ isBusy: $isBusy, error: '' });
			});
		} catch (error) {
			console.error(error);
			const errorMessage = error instanceof Error ? error.message : '';
			self.postMessage({ error: errorMessage });
		}
	}
});
