<script context="module" lang="ts">
	import { Temporal } from '@js-temporal/polyfill';
	import { freeBusy, TimePeriod } from '$lib/third_party/freebusy';
	import { readable } from 'svelte/store';

	const knownPeople = new Map(
		Object.entries({
			'tigeroakes@gmail.com': {
				name: 'Tiger',
				image: '/assets/img/tiger.jpg'
			},
			'daphne.liu97@gmail.com': {
				name: 'Daphne',
				image: '/assets/img/daphne.jpg'
			}
		})
	);

	interface BusyState {
		busy: boolean;
		next?: Temporal.ZonedDateTime;
	}

	async function fetchFreeBusy(calendarId: string) {
		const today = Temporal.Now.zonedDateTimeISO('UTC').startOfDay();
		const response = await freeBusy({
			timeMin: today,
			timeMax: today.add({ days: 5 }),
			items: [{ id: calendarId }]
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
</script>

<script lang="ts">
	import FormattedTime from '$lib/components/Frame/FormattedTime.svelte';
	import { filterState } from '$lib/filter-state';
	import { getFrameContext } from './__layout.svelte';

	const { state } = getFrameContext();
	$: busyState = filterState('BUSY', state);
	$: calendarId = $busyState?.payload;

	let freeBusyRanges: readonly TimePeriod[] = [];
	let error: string = '';

	$: knownPerson = calendarId ? knownPeople.get(calendarId) : undefined;

	$: isBusy = isBusyInterval(freeBusyRanges);
	$: {
		if (calendarId) {
			fetchFreeBusy(calendarId)
				.then((ranges) => {
					freeBusyRanges = ranges;
					error = '';
				})
				.catch((err) => {
					error = err;
				});
		}
	}
</script>

<main class="fill center" class:busy={$isBusy.busy} class:error={Boolean(error)}>
	{#if knownPerson}
		<img
			class="profile"
			alt="Portrait of {knownPerson.name}"
			src={knownPerson.image}
			width="150"
			height="150"
		/>
	{/if}
	<h1 class="headline-1">{$isBusy.busy ? 'Busy' : 'Free'}</h1>
	{#if $isBusy.next}
		<span>until <FormattedTime time={$isBusy.next} /></span>
	{/if}
	{#if error}
		<span>{error}</span>
	{/if}
</main>

<style>
	main {
		background: #262626;
	}
	main.busy {
		background: #d87220;
	}
	main.error {
		background: red;
	}
	.profile {
		display: block;
		border-radius: 50%;
	}
</style>
