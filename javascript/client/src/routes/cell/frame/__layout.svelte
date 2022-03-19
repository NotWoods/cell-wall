<script context="module" lang="ts">
	import type { CellState } from '@cell-wall/shared';
	import type { Load } from '@sveltejs/kit';
	import { getContext, setContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	export function getFrameContext(): { socket: WebSocket; state: Readable<CellState> } {
		return getContext('frame') as { socket: WebSocket; state: Readable<CellState> };
	}

	export const load: Load = async ({ url }) => {
		const id = url.searchParams.get('id');
		if (!id) {
			return {
				status: 400,
				error: new Error('Missing ID')
			};
		}

		return {
			props: {
				serial: id
			}
		};
	};
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { cellState, connect, sendResizeEvents } from '$lib/connection/state-socket';
	import { onMount } from 'svelte';
	import PageTransition from './_PageTransition.svelte';

	export let serial: string;

	const socket = connect(serial);
	const state = cellState(socket);

	onMount(() => {
		sendResizeEvents(socket);
	});

	setContext('frame', { socket, state });

	socket?.addEventListener('error', (event) => console.error('Socket error', event));
	socket?.addEventListener('open', (event) => console.info('Socket open', event));
	socket?.addEventListener('close', (event) => console.info('Socket close', event));

	$: url = `/cell/frame/${$state.type.toLowerCase()}`;
	$: {
		console.log('CellState', $state);
	}
	$: {
		if (browser) {
			goto(`${url}?id=${serial}`, { replaceState: true });
		}
	}
</script>

<svelte:head>
	<title>Cell</title>
</svelte:head>

<PageTransition key={url}>
	<slot />
</PageTransition>
