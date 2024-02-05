<script lang="ts">
	import { filterState } from '$lib/stores/filter-state';
	import { randomItem } from '@notwoods/webish';
	import { RAINBOW_COLORS } from '@cell-wall/shared';
	import { frameContext } from '../context';

	const randomDefaultColor = randomItem(RAINBOW_COLORS);
	const textState = filterState('TEXT', frameContext.state);

	$: text = $textState?.payload || '';
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
