<script context="module" lang="ts">
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
</script>

<script lang="ts">
	import FormattedTime from '$lib/components/Frame/FormattedTime.svelte';
	import { filterState } from '$lib/stores/filter-state';
	import { frameContext } from '../context';

	const clockState = filterState('CLOCK', frameContext.state);

	const time = intervalClock();
</script>

<main class="fill center">
	<h1 class="clock">
		<FormattedTime time={$time} timeZone={$clockState?.payload || undefined} />
	</h1>
</main>

<style>
	main {
		background: #1f1f1f;
		color: #c5eed0;
	}
	.clock {
		text-align: center;
		font-size: 72px;
		margin: 8px;
	}
</style>
