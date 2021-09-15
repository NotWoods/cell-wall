import proposalTemporal from 'https://cdn.skypack.dev/@js-temporal/polyfill';
const { Temporal } = proposalTemporal;

/** @typedef {import('@js-temporal/polyfill').Temporal.Instant} Instant */
/** @typedef {import('@js-temporal/polyfill').Temporal.ZonedDateTime} ZonedDateTime */

/**
 * @typedef {object} TimeStampRange
 * @prop {string} start
 * @prop {string} end
 */

/**
 * @typedef {object} DateTimeRange
 * @prop {ZonedDateTime} start
 * @prop {ZonedDateTime} end
 */

/**
 * @param {TimeStampRange} range
 * @returns {DateTimeRange}
 */
function convert(range) {
  /**
   * @param {string | Instant} timestamp
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
 * @param {ZonedDateTime} time Date time stamp to check
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
