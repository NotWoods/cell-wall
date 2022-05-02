import { Temporal } from '@js-temporal/polyfill';
import { readable } from 'svelte/store';

export interface TimePeriod {
	/** The (inclusive) start of the time period. */
	start?: string | null;
	/** The (exclusive) end of the time period. */
	end?: string | null;
}

export interface BusyState {
	busy: boolean;
	next?: Temporal.ZonedDateTime;
}

/**
 * @param ranges List of time ranges
 * @return Store that is true when the current time is in the busy range
 */
export function isBusyInterval(ranges: readonly TimePeriod[]) {
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
	function isBusy(time: Temporal.ZonedDateTime) {
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
		return { busy: false, next: undefined };
	}

	return readable<ReturnType<typeof isBusy>>({ busy: false, next: undefined }, (set) => {
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
