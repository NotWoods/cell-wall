<script lang="ts">
	import { filterState } from '@cell-wall/cell-state';
	import { getFrameContext } from './__layout.svelte';

	const { state } = getFrameContext();

	let frame: HTMLIFrameElement | undefined;

	$: webState = filterState('WEB', $state);
	$: {
		console.log($state, $state.type, webState);
	}

	$: url = webState?.payload || 'about:blank';
	$: {
		if (frame) {
			console.log('web state', $state, url);
			frame.src = url;
		}
	}
</script>

<iframe src={url} title="Cell content" bind:this={frame} />

<style>
	iframe {
		display: block;
		height: 100%;
		width: 100%;
		border: 0;
	}
</style>
