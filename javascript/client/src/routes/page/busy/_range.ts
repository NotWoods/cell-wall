import { Temporal } from '@js-temporal/polyfill';

export interface TimePeriod {
	/** The (inclusive) start of the time period. */
	start?: string | null;
	/** The (exclusive) end of the time period. */
	end?: string | null;
}

export interface DateTimeRange {
	start: Temporal.ZonedDateTime | undefined;
	end: Temporal.ZonedDateTime | undefined;
}

function convert(range: TimePeriod): DateTimeRange {
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
}

/**
 * Check if the given time is within a time range
 * @param time Date time stamp to check
 * @param ranges List of time ranges
 */
function isBusy(time: Temporal.ZonedDateTime, ranges: readonly DateTimeRange[]) {
	for (const range of ranges) {
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

/**
 * @param ranges List of time ranges
 * @param callback
 */
export function isBusyInterval(
	ranges: readonly TimePeriod[],
	callback: (inRange: boolean) => void
): void {
	const dateTimeRanges = ranges.map(convert);

	function checkBusy() {
		const now = Temporal.Now.zonedDateTimeISO('UTC');
		const { busy, next } = isBusy(now, dateTimeRanges);
		callback(busy);

		if (next) {
			const duration = now.until(next);
			console.log(`Waiting until ${duration}`);

			const ms = duration.total({ unit: 'milliseconds' });
			setTimeout(checkBusy, Math.max(ms, 1000));
		}
	}
	checkBusy();
}
