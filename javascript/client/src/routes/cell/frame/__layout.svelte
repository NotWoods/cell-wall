<script context="module" lang="ts">
	import type { CellState } from '@cell-wall/cell-state';
	import type { Load } from '@sveltejs/kit';
	import { getContext, setContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	export function getFrameContext() {
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
	import { cellState, connect } from '$lib/connection/state-socket';
	import { goto } from '$app/navigation';

	export let serial: string;

	const socket = connect(serial);
	const state = cellState(socket);

	setContext('frame', { socket, state });

	socket.addEventListener('error', (event) => console.error('Socket error', event));
	socket.addEventListener('open', (event) => console.info('Socket open', event));
	socket.addEventListener('close', (event) => console.info('Socket close', event));

	$: url = `/cell/frame/${$state.type.toLowerCase()}`;
	$: {
		goto(`${url}?serial=${serial}`);
	}
</script>

<svelte:head>
	<title>CellWall</title>
</svelte:head>
