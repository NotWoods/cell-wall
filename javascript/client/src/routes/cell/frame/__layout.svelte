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
	import { cellState, connect, frameUrl, sendResizeEvents } from '$lib/connection/state-socket';
	import { onMount } from 'svelte';

	export let serial: string;
	let socketState: 'open' | 'error' | 'close' = 'open';

	const socket = connect(serial);
	const state = cellState(socket);

	onMount(() => {
		sendResizeEvents(socket);
	});

	setContext('frame', { socket, state });

	socket?.addEventListener('error', () => {
		socketState = 'error';
	});
	socket?.addEventListener('close', () => {
		socketState = 'close';
	});

	$: url = frameUrl($state.type, serial);
	$: {
		if (browser) {
			goto(url, { replaceState: true });
		}
	}
</script>

<svelte:head>
	<title>Cell</title>
</svelte:head>

<slot />

{#if socketState !== 'open'}
	<svg
		class="socket-error"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		height="24px"
		width="24px"
		fill={socketState === 'error' ? '#DC2626' : '#EA580C'}
		stroke="#fff"
	>
		<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
	</svg>
{/if}

<style>
	.socket-error {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1;
	}
</style>
