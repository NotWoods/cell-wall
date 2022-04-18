<script lang="ts">
	import { splitToBuckets } from '$lib/canvas/buckets';
	import { fitScale } from '$lib/canvas/fit-scale';
	import { elementSizeStore } from '$lib/canvas/resize-store';
	import { cellCanvas } from '@cell-wall/shared';
	import SelectAppCard from './_SelectAppCard.svelte';
	import { getRemoteContext } from './__layout.svelte';

	const { state: remoteState } = getRemoteContext();

	let container: HTMLElement | undefined;

	$: elementSize = elementSizeStore(container);
	$: buckets = splitToBuckets($remoteState);
	$: cellCanvasRect = cellCanvas(buckets.rectWithPos);
	$: scale = $elementSize
		? fitScale({ width: $elementSize.width, height: Infinity }, cellCanvasRect)
		: 1;
</script>

<section bind:this={container} class="relative" style="height: {cellCanvasRect.height * scale}px">
	{#each buckets.rectWithPos as info (info.serial)}
		<SelectAppCard {info} {scale} app={undefined} />
	{/each}
</section>
