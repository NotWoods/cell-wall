<script context="module" lang="ts">
	import type { CellData } from '@cell-wall/shared';
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

	export function getSnackbarHostContext() {
		return getContext(SnackbarHostState) as SnackbarHostState;
	}
</script>

<script lang="ts">
	import NavigationProgress from '$lib/components/NavigationProgress.svelte';
	import RemoteFrame from '$lib/components/RemoteFrame.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import TopBar from '$lib/components/TopBar/TopBar.svelte';
	import { connectRemote, remoteState } from '$lib/connection/remote-socket';
	import { SnackbarHostState } from '$lib/snackbar-host';
	import { setContext } from 'svelte';

	const socket = connectRemote();
	const state = remoteState(socket);

	setContext('remote', { socket, state });

	const snackbarHostState = new SnackbarHostState();
	const { currentSnackbarData } = snackbarHostState;
	setContext(SnackbarHostState, snackbarHostState);

	socket?.addEventListener('error', (event) => {
		console.error('RemoteSocket error', event);
		snackbarHostState.showSnackbar('Remote socket error');
	});
	socket?.addEventListener('open', (event) => console.info('RemoteSocket open', event));
	socket?.addEventListener('close', (event) => console.info('RemoteSocket close', event));
</script>

<svelte:head>
	<title>CellWall Remote</title>
	<link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

<NavigationProgress />
<TopBar />
<RemoteFrame>
	<slot />
</RemoteFrame>

<Snackbar data={$currentSnackbarData} />
