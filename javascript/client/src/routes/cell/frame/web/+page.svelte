<script lang="ts">
	import { filterState } from '$lib/filter-state';
	import { getFrameContext } from '../+layout.svelte';

	const { state } = getFrameContext();
	const webState = filterState('WEB', state);

	let frame: HTMLIFrameElement | undefined;

	$: url = $webState?.payload || 'about:blank';
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
