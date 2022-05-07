<script lang="ts">
	import { filterState } from '$lib/filter-state';
	import { RAINBOW_COLORS, randomItem } from '@cell-wall/shared';
	import { getFrameContext } from './__layout.svelte';

	const randomDefaultColor = randomItem(RAINBOW_COLORS);
	const { state } = getFrameContext();
	$: textState = filterState('TEXT', state);

	$: text = $textState?.payload || 'CellWall';
	$: backgroundColor = $textState?.backgroundColor || randomDefaultColor;
</script>

<main class="fill center" style="background: {backgroundColor};">
	<h1 class="headline-1">{text}</h1>
</main>

<style>
	main {
		text-align: center;
	}
	h1 {
		margin: 8px;
	}
</style>
