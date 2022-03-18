<script lang="ts">
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { connectThirdParty, thirdPartyState } from '$lib/connection/third-party-socket';
	import { getSnackbarHostContext } from './__layout.svelte';

	const buttonClassNames =
		'px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-colors bg-slate-700 hover:bg-slate-800 disabled:bg-slate-600 disabled:opacity-50';

	const socket = connectThirdParty();
	const state = thirdPartyState(socket);

	const snackbarHostState = getSnackbarHostContext();
	socket?.addEventListener('error', (event) => {
		console.error('ThirdPartySocket error', event);
		snackbarHostState.showSnackbar('Third party socket error');
	});
	socket?.addEventListener('open', (event) => console.info('ThirdPartySocket open', event));
	socket?.addEventListener('close', (event) => console.info('ThirdPartySocket close', event));
</script>

<svelte:head>
	<title>SDK Login | CellWall</title>
</svelte:head>

<p class="mb-6">Connect to third party APIs to use in CellWall.</p>

<HorizontalField label="Google">
	{#if $state.google_loading}
		<LoadingSpinner />
	{:else if $state.google_authorize_url}
		<a class={buttonClassNames} href={$state.google_authorize_url}>Sign in to Google</a>
	{:else}
		<button class={buttonClassNames} type="button" disabled>Logged in to Google</button>
	{/if}
</HorizontalField>
