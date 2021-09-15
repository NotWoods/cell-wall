import { Temporal } from '@js-temporal/polyfill';

/** @typedef {import('@js-temporal/polyfill').Temporal.Instant} Instant */
/** @typedef {import('@js-temporal/polyfill').Temporal.ZonedDateTime} ZonedDateTime */

/**
 * @typedef {object} TimeStampRange
 * @prop {string} start
 * @prop {string} end
 */

export interface TimeStampRange {
	start: string;
	end: string;
}

export interface DateTimeRange {
	start: Temporal.ZonedDateTime;
	end: Temporal.ZonedDateTime;
}

function convert(range: TimeStampRange): DateTimeRange {
	function fromTimeStamp(timestamp: string | Temporal.Instant) {
		return Temporal.Instant.from(timestamp).toZonedDateTimeISO('UTC');
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

		if (Temporal.ZonedDateTime.compare(time, start) < 0) {
			// range is later, stop now because list is ordered
			return { busy: false, next: range.start };
		} else if (Temporal.ZonedDateTime.compare(time, end) <= 0) {
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
	ranges: readonly TimeStampRange[],
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
