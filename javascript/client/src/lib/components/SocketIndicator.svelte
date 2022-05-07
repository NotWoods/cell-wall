<script context="module" lang="ts">
	import { readable } from 'svelte/store';

	function socketConnectionState(socket: WebSocket) {
		return readable<'open' | 'error' | 'close'>('open', (set) => {
			const controller = new AbortController();
			socket?.addEventListener('error', () => set('error'), controller);
			socket?.addEventListener('close', () => set('close'), controller);

			return () => controller.abort();
		});
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	export let socket: WebSocket;

	$: socketState = socketConnectionState(socket);

	onMount(() => {
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible' && get(socketState) !== 'open') {
				location.reload();
			}
		});
	});
</script>

{#if $socketState !== 'open'}
	<svg
		class="socket-error"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		height="24px"
		width="24px"
		fill={$socketState === 'error' ? '#DC2626' : '#EA580C'}
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
