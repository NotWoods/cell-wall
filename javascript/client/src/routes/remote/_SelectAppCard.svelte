<script lang="ts">
	import { applyScale } from '$lib/canvas/fit-scale';

	import type { CellInfo, RectangleWithPosition } from '@cell-wall/shared';

	export let info: CellInfo & RectangleWithPosition;
	export let scale: number;

	$: rect = applyScale(info, scale);
</script>

<article
	class="bg-slate-800 p-2 border rounded border-slate-700 absolute box-border"
	href="/remote/select-app/{info.serial}"
	style="left: {rect.x}px; top: {rect.y}px; width: {rect.width}px; height: {rect.height}px;"
>
	<h3 class="text-lg">{info.deviceName || info.serial}</h3>
</article>
