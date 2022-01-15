<script lang="ts" context="module">
	import { Temporal } from '@js-temporal/polyfill';
	import type { Load } from '@sveltejs/kit';
	import type { calendar_v3 } from 'googleapis';
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
		const nextWeek = today.add({ days: 5 });
		const toStringOptions = {
			timeZoneName: 'never',
			smallestUnit: 'second'
		} as const;

		const body: calendar_v3.Schema$FreeBusyRequest = {
			timeMin: today.toString(toStringOptions),
			timeMax: nextWeek.toString(toStringOptions),
			items: [{ id: people[person].calendar }]
		};
		const res = await fetch('/api/third_party/freebusy', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!res.ok) {
			return {
				status: res.status,
				error: new Error(`Could not load calendar, ${res.statusText}`)
			};
		}

		const busy = await res.json();

		return {
			props: {
				name: person,
				busyRanges: busy
			}
		};
	};
</script>

<script lang="ts">
	export let busyRanges: readonly calendar_v3.Schema$TimePeriod[];
	export let name: keyof People;
	$: person = people[name];

	let stateName: keyof typeof states = 'free';
	$: state = states[stateName];

	isBusyInterval(busyRanges, (isBusy) => {
		stateName = isBusy ? 'busy' : 'free';
	});
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
