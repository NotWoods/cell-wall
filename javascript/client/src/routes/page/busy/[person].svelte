<script lang="ts" context="module">
	import { freeBusy } from '$lib/third_party/freebusy';
	import { Temporal } from '@js-temporal/polyfill';
	import type { Load } from '@sveltejs/kit';
	import { isBusyInterval } from './_range';

	const people = {
		tiger: {
			name: 'Tiger',
			image: '/assets/img/tiger.jpg',
			calendar: 'tigeroakes@gmail.com'
		},
		daphne: {
			name: 'Daphne',
			image: '/assets/img/daphne.jpg',
			calendar: 'daphne.liu97@gmail.com'
		}
	};

	const states = {
		free: {
			text: 'Free',
			background: '#262626'
		},
		busy: {
			text: 'Busy',
			background: '#d87220'
		}
	};

	type People = typeof people;

	function isPerson(person: string): person is keyof People {
		return person in people;
	}

	export const load: Load = async ({ params }) => {
		const { person } = params;

		if (!isPerson(person)) {
			return {
				status: 404,
				error: new Error(`No matching data for ${person}`)
			};
		}

		const today = Temporal.Now.zonedDateTimeISO('UTC').startOfDay();
		const response = await freeBusy({
			timeMin: today,
			timeMax: today.add({ days: 5 }),
			items: [{ id: people[person].calendar }]
		});

		if (!response.ok) {
			return {
				status: response.status,
				error: new Error(`Could not load calendar, ${response.statusText}`)
			};
		}

		const busy = await response.json();

		return {
			props: {
				person: people[person],
				busyRanges: busy
			}
		};
	};
</script>

<script lang="ts">
	import FormattedTime from '$lib/components/Frame/FormattedTime.svelte';
	import type { TimePeriod } from '$lib/third_party/freebusy';

	export let busyRanges: readonly TimePeriod[];
	export let person: People[keyof People];

	const isBusy = isBusyInterval(busyRanges);
	$: state = states[$isBusy.busy ? 'busy' : 'free'];
</script>

<body style="background: {state.background}">
	<img
		class="profile"
		alt="Portrait of ${person.name}"
		src="${person.image}"
		width="150"
		height="150"
	/>
	<h1 class="headline-1">{state.text}</h1>
	{#if $isBusy.next}
		until <FormattedTime time={$isBusy.next} />
	{/if}
</body>

<style>
	body {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.profile {
		display: block;
		border-radius: 50%;
	}
</style>
