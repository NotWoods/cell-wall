<script lang="ts">
	import { filterState } from '@cell-wall/cell-state';
	import { getFrameContext } from './__layout.svelte';

	const { state } = getFrameContext();
	$: textState = filterState('TEXT', $state);

	$: text = textState?.payload || 'CellWall';
	$: backgroundColor = textState?.backgroundColor || '#429A46';
</script>

<main style="background: {backgroundColor};">
	<h1 class="headline-1">{text}</h1>
</main>

<style>
	main {
		display: flex;
		height: 100vh;
		align-items: center;
	}
	h1 {
		margin: 8px;
	}
</style>
