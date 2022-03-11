<script context="module" lang="ts">
	import type { CellData } from '@cell-wall/cell-state';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	export function getRemoteContext(): {
		socket: WebSocket;
		state: Readable<ReadonlyMap<string, CellData>>;
	} {
		return getContext('remote') as {
			socket: WebSocket;
			state: Readable<ReadonlyMap<string, CellData>>;
		};
	}
</script>

<script lang="ts">
	import NavigationProgress from '$lib/components/NavigationProgress.svelte';
	import { SnackbarHostState } from '$lib/snackbar-host';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import WithTopBar from '$lib/components/WithTopBar.svelte';
	import { setContext } from 'svelte';
	import { connectRemote, remoteState } from '$lib/connection/remote-socket';

	const socket = connectRemote();
	const state = remoteState(socket);

	setContext('remote', { socket, state });

	const snackbarHostState = new SnackbarHostState();
	const { currentSnackbarData } = snackbarHostState;
	setContext(SnackbarHostState, snackbarHostState);

	socket?.addEventListener('error', (event) => console.error('RemoteSocket error', event));
	socket?.addEventListener('open', (event) => console.info('RemoteSocket open', event));
	socket?.addEventListener('close', (event) => console.info('RemoteSocket close', event));
</script>

<svelte:head>
	<title>CellWall Remote</title>
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<NavigationProgress />
<WithTopBar>
	<slot />
</WithTopBar>

<Snackbar data={$currentSnackbarData} />
