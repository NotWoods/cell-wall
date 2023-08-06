
import { readable } from 'svelte/store';

function intervalClock() {
	return readable(new Date(), (set) => {
		let timeout: ReturnType<typeof setTimeout> | undefined;

		function tick() {
			const now = new Date();
			set(now);

			const nextMinute = new Date(now);
			nextMinute.setMilliseconds(0);
			nextMinute.setSeconds(0);
			nextMinute.setMinutes(now.getMinutes() + 1);

			const timeToNextMinuteMs = nextMinute.getTime() - now.getTime();
			timeout = setTimeout(tick, timeToNextMinuteMs);
		}
		tick();

		return () => clearTimeout(timeout!);
	});
}
