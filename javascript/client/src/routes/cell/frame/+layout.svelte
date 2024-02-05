<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import SocketIndicator from '$lib/components/SocketIndicator.svelte';
	import { cellState, connect, frameUrl, sendResizeEvents } from '$lib/connection/state-socket';
	import { onMount } from 'svelte';
	import PageTransition from '../_PageTransition.svelte';
	import { frameContext } from './context';

	export let data: import('./$types').LayoutData;

	const socket = connect(data.serial);
	const state = cellState(socket);

	onMount(() => {
		sendResizeEvents(socket);
	});

	frameContext.socket = socket;
	frameContext.state = state

	$: url = frameUrl($state.type, data.serial);
	$: {
		if (browser) {
			goto(url, { replaceState: true });
		}
	}
</script>

<svelte:head>
	<title>Cell</title>
</svelte:head>

<div class="layout">
	{#key $state.type}
		<PageTransition>
			<slot />
		</PageTransition>
	{/key}
</div>

{#if socket}
	<SocketIndicator {socket} />
{/if}

<style>
	.layout {
		position: relative;
		height: 100vh;
		height: 100dvh;
		width: 100vw;
		background: #429a46;
		overflow: hidden;
	}
</style>
