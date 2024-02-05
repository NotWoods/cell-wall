<script lang="ts">
	import { splitToBuckets } from '$lib/canvas/buckets';
	import { fitScale } from '$lib/canvas/fit-scale';
	import { elementSizeStore } from '$lib/canvas/resize-store';
	import { cellCanvas } from '@cell-wall/shared';
	import SelectAppCard from './_SelectAppCard.svelte';
	import SelectAppContent from './_SelectAppContent.svelte';
	import { remoteContext } from './context';

	const remoteState = remoteContext.state;

	let container: HTMLElement | undefined;

	$: elementSize = elementSizeStore(container);
	$: buckets = splitToBuckets($remoteState);
	$: cellCanvasRect = cellCanvas(buckets.rectWithPos);
	$: scale = $elementSize
		? fitScale({ width: $elementSize.width, height: Infinity }, cellCanvasRect)
		: 1;

	$: heightStyle =
		cellCanvasRect.height !== Infinity ? `${cellCanvasRect.height * scale}px` : 'auto';
</script>

<section bind:this={container} class="relative" style="height: {heightStyle}">
	{#each buckets.rectWithPos as info (info.serial)}
		<SelectAppCard {info} {scale} state={$remoteState.get(info.serial)?.state} />
	{/each}
</section>
<div class="grid gap-4">
	{#each buckets.rect as info (info.serial)}
		<article
			class="bg-slate-800 p-2 border rounded border-slate-700 flex flex-col box-border overflow-hidden"
		>
			<SelectAppContent {info} state={$remoteState.get(info.serial)?.state} />
		</article>
	{/each}
	{#each buckets.rest as info (info.serial)}
		<article
			class="bg-slate-800 p-2 border rounded border-slate-700 flex flex-col box-border overflow-hidden"
		>
			<SelectAppContent {info} state={$remoteState.get(info.serial)?.state} />
		</article>
	{/each}
</div>

<style>
	.grid {
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}
</style>
