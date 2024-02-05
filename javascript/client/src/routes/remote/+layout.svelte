<script lang="ts">
	import NavigationProgress from '$lib/components/NavigationProgress.svelte';
	import RemoteFrame from '$lib/components/RemoteFrame.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import TopBar from '$lib/components/TopBar/TopBar.svelte';
	import { connectRemote, remoteState } from '$lib/connection/remote-socket';
	import { SnackbarHostState } from '$lib/snackbar-host';
	import { remoteContext } from './context';

	const socket = connectRemote();
	const state = remoteState(socket);

	remoteContext.socket = socket;
	remoteContext.state = state;

	const snackbarHostState = new SnackbarHostState();
	remoteContext.snackbarHost = snackbarHostState;
	const { currentSnackbarData } = snackbarHostState;

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
