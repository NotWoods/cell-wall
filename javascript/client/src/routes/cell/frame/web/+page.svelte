<script lang="ts">
	import { filterState } from '$lib/filter-state';
	import { frameContext } from '../context';

	const webState = filterState('WEB', frameContext.state);

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
