<script lang="ts">
	import { browser } from '$app/environment';
	import { goto, preloadCode } from '$app/navigation';
	import { frameUrl } from '$lib/connection/state-socket';
	import { requestFullScreen, requestWakeLock } from '$lib/stores/wakelock';
	import { onMount } from 'svelte';
	import { cellStateTypes } from '@cell-wall/shared';

	export let data: import('./$types').PageData;

	let id = data.id || '';
	onMount(() => {
		// Load previous ID from local storage, if not set by the URL
		if (!id) {
			const lastId = localStorage.getItem('id');
			if (lastId) {
				id = lastId;
			}
		}
	});

	async function submit() {
		localStorage.setItem('id', id);

		requestFullScreen();
		requestWakeLock();

		const routePrefetchJob = Promise.all(
			Array.from(cellStateTypes, (type) => preloadCode(frameUrl(type, id)))
		);

		await goto(frameUrl('BLANK', id), { replaceState: false });
		await routePrefetchJob;
	}

	function reset() {
		localStorage.removeItem('id');
	}

	$: {
		if (data.autoJoin && browser) {
			submit();
		}
	}
</script>

<svelte:head>
	<title>New Cell | CellWall</title>
</svelte:head>

<div class="fill center wrapper">
	<form action="/cell/frame/blank" method="get" on:submit|preventDefault={submit}>
		<img src="/logo.png" alt="" width="48" height="48" />

		<label for="control-id">Cell ID</label>
		<input id="control-id" name="id" type="text" required bind:value={id} />

		<div class="buttons">
			<button type="reset" on:click={reset}>Reset</button>
			<button type="submit">Join</button>
		</div>
	</form>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		row-gap: 1em;
		max-width: 100vw;
		font-size: 1.5rem;
	}
	input,
	button {
		font: inherit;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
	}
	button {
		padding: 0.2em 1em;
	}

	@media (max-width: 21rem) {
		form {
			font-size: 1rem;
		}
		label {
			font-size: 1.5em;
		}
	}
</style>
