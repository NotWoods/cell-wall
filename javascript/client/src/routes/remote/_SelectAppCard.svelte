<script lang="ts">
	import { applyScale } from '$lib/canvas/fit-scale';
	import type { CellInfo, CellState, RectangleWithPosition } from '@cell-wall/shared';
	import SelectAppContent from './_SelectAppContent.svelte';

	export let info: CellInfo & RectangleWithPosition;
	export let scale: number;
	export let state: CellState | undefined;

	$: rect = applyScale(info, scale);
	$: small = rect.height < 150;
</script>

<article
	class="bg-slate-800 p-2 border rounded border-slate-700 flex flex-col absolute box-border overflow-hidden"
	style="left: {rect.x}px; top: {rect.y}px; width: {rect.width}px; height: {rect.height}px;"
>
	<SelectAppContent {info} {state} {small} />
</article>
