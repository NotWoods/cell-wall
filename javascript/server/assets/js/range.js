import { Temporal } from 'https://cdn.skypack.dev/proposal-temporal';

/**
 * @typedef {object} TimeStampRange
 * @prop {string} start
 * @prop {string} end
 */

/**
 * @typedef {object} DateTimeRange
 * @prop {Temporal.ZonedDateTime} start
 * @prop {Temporal.ZonedDateTime} end
 */

/**
 * @param {TimeStampRange} range
 * @returns {DateTimeRange}
 */
function convert(range) {
  /**
   * @param {string | Temporal.Instant} timestamp
   */
  function fromTimeStamp(timestamp) {
    return Temporal.Instant.from(timestamp).toZonedDateTimeISO('UTC');
  }

  return {
    start: fromTimeStamp(range.start),
    end: fromTimeStamp(range.end),
  };
}

/**
 * Check if the given time is within a time range
 * @param {Temporal.ZonedDateTime} time Date time stamp to check
 * @param {readonly DateTimeRange[]} ranges List of time ranges
 */
function isBusy(time, ranges) {
  for (const range of ranges) {
    const { start, end } = range;

    if (Temporal.ZonedDateTime.compare(time, start) < 0) {
      // range is later, stop now because list is ordered
      return { busy: false, next: range.start };
    } else if (Temporal.ZonedDateTime.compare(time, end) <= 0) {
      // this is the current range
      return { busy: true, next: range.end };
    } else {
      // range was soonar
      continue;
    }
  }
  return { busy: false, next: undefined };
}

/**
 * @param {readonly TimeStampRange[]} ranges List of time ranges
 * @param {(inRange: boolean) => void} callback
 */
export function isBusyInterval(ranges, callback) {
  const dateTimeRanges = ranges.map(convert);

  function checkBusy() {
    const now = Temporal.now.zonedDateTimeISO('UTC');
    const { busy, next } = isBusy(now, dateTimeRanges);
    callback(busy);

    if (next) {
      const duration = now.until(next);
      const ms = duration.total({ unit: 'milliseconds' });
      setTimeout(checkBusy, ms);
    }
  }
  checkBusy();
}

export { Temporal };
