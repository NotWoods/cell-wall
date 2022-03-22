<script lang="ts">
	import { filterState } from '@cell-wall/shared';
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

<iframe class="fill" src={url} title="Cell content" bind:this={frame} />

<style>
	iframe {
		border: 0;
		background: white;
	}
</style>
