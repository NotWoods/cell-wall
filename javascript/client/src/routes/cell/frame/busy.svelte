<script context="module" lang="ts">
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
</script>

<script lang="ts">
	import FormattedTime from '$lib/components/Frame/FormattedTime.svelte';
	import { filterState } from '$lib/filter-state';
	import type { BusyState } from '../../../workers/busy';
	import { messages } from '../../../workers/store';
	import { getFrameContext } from './__layout.svelte';

	const worker = new Worker(new URL('../../../workers/busy.js', import.meta.url));

	const { state } = getFrameContext();
	$: busyState = filterState('BUSY', state);
	$: calendarId = $busyState?.payload;

	$: {
		worker.postMessage(calendarId);
	}
	$: workerState = messages<{ error: string; isBusy?: BusyState }>(worker, { error: '' });

	$: knownPerson = calendarId ? knownPeople.get(calendarId) : undefined;
	$: isBusy = $workerState.isBusy ?? { busy: false };
	$: error = $workerState.error;
</script>

<main class="fill center" class:busy={isBusy.busy} class:error={Boolean(error)}>
	{#if knownPerson}
		<img
			class="profile"
			alt="Portrait of {knownPerson.name}"
			src={knownPerson.image}
			width="150"
			height="150"
		/>
	{/if}
	<h1 class="headline-1">{isBusy.busy ? 'Busy' : 'Free'}</h1>
	{#if isBusy.next}
		<span>until <FormattedTime time={isBusy.next} /></span>
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
