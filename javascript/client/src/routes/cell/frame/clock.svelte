<script context="module" lang="ts">
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
</script>

<script lang="ts">
	import { filterState } from '@cell-wall/shared';
	import { readable } from 'svelte/store';
	import { getFrameContext } from './__layout.svelte';

	const { state } = getFrameContext();
	$: clockState = filterState('CLOCK', $state);
	$: timeZone = clockState?.payload;
	$: formatter = new Intl.DateTimeFormat(undefined, {
		timeStyle: 'short',
		timeZone
	});

	$: time = intervalClock();
</script>

<main class="fill center">
	<h1 class="headline-1">{formatter.format($time)}</h1>
</main>

<style>
	main {
		background: #1f1f1f;
		color: #c5eed0;
	}
	h1 {
		margin: 8px;
	}
</style>
