<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';

	import RemoteFrame from '$lib/components/RemoteFrame.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import TopBar from '$lib/components/TopBar/TopBar.svelte';
	import { connectThirdParty, thirdPartyState } from '$lib/connection/third-party-socket';
	import { SnackbarHostState } from '$lib/snackbar-host';
	import { setContext } from 'svelte';

	const socket = connectThirdParty();
	const state = thirdPartyState(socket);

	const snackbarHostState = new SnackbarHostState();
	const { currentSnackbarData } = snackbarHostState;
	setContext(SnackbarHostState, snackbarHostState);
</script>

<svelte:head>
	<title>SDK Login | CellWall</title>
</svelte:head>

<TopBar />
<RemoteFrame>
	<p class="mb-6">Connect to third party APIs to use in CellWall.</p>

	<HorizontalField label="Google">
		{#if $state.google_authorize_url}
			<Button disabled>Logged in to Google</Button>
		{:else}
			<Button>Sign in to Google</Button>
		{/if}
	</HorizontalField>
</RemoteFrame>

<Snackbar data={$currentSnackbarData} />=
