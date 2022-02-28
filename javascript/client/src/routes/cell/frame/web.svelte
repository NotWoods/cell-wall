<script lang="ts">
	import { filterState } from '@cell-wall/cell-state';
	import { getFrameContext } from './__layout.svelte';

	const { state } = getFrameContext();

	let frame: HTMLIFrameElement | undefined;

	$: webState = filterState('WEB', $state);

	$: url = webState?.payload || 'about:blank';
	$: {
		if (frame) {
			frame.src = url;
		}
	}
</script>

<iframe src={url} title="Cell content" bind:this={frame} />

<style>
	iframe {
		height: 100vh;
		width: 100vw;
	}
</style>
