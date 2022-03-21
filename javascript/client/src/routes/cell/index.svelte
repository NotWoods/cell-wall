<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ url }) => {
		return {
			props: {
				id: url.searchParams.get('id') || '',
				autoJoin: url.searchParams.has('autojoin')
			}
		};
	};
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { requestFullScreen, requestWakeLock } from '$lib/wakelock';
	import { onMount } from 'svelte';

	export let id = '';
	export let autoJoin = false;

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

		await goto(`/cell/frame/blank?id=${id}`, { replaceState: false });
	}

	function reset() {
		localStorage.removeItem('id');
	}

	$: {
		if (autoJoin && browser) {
			submit();
		}
	}
</script>

<svelte:head>
	<title>New Cell | CellWall</title>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="CellWall" />
	<link rel="apple-touch-icon" sizes="274x274" href="/maskable_icon.png" />
</svelte:head>

<div class="wrapper">
	<form action="/cell/frame/blank" method="get">
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
	.wrapper {
		height: 100dvh;
		height: 100vh;
		background: #429a46;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
	}
	form {
		display: flex;
		flex-direction: column;
		row-gap: 1em;
		max-width: 100vw;
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
		.wrapper {
			font-size: 1rem;
		}
		label {
			font-size: 1.5em;
		}
	}
</style>
