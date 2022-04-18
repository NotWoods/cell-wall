<script lang="ts">
	import { applyScale } from '$lib/canvas/fit-scale';

	import type { CellInfo, RectangleWithPosition } from '@cell-wall/shared';

	export let info: CellInfo & RectangleWithPosition;
	export let scale: number;

	export let app: object | undefined;

	$: rect = applyScale(info, scale);
	$: small = rect.height < 150;
</script>

<article
	class="bg-slate-800 p-2 border rounded border-slate-700 flex flex-col absolute box-border overflow-hidden"
	href="/remote/select-app/{info.serial}"
	style="left: {rect.x}px; top: {rect.y}px; width: {rect.width}px; height: {rect.height}px;"
>
	<h3 class="text-md">{info.deviceName || info.serial}</h3>
	{#if app}
		TODO
	{:else}
		<a
			href="/remote/apps/select/{info.serial}"
			class="m-auto flex items-center text-center gap-1 rounded-lg transition-colors hover:bg-slate-900"
			class:flex-col={!small}
			class:p-4={!small}
			class:p-2={small}
			class:text-sm={small}
		>
			<svg
				class:w-12={!small}
				class:h-12={!small}
				class:w-6={small}
				class:h-6={small}
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path
					d="M2,2H11V11H2V2M17.5,2C20,2 22,4 22,6.5C22,9 20,11 17.5,11C15,11 13,9 13,6.5C13,4 15,2 17.5,2M6.5,14L11,22H2L6.5,14M19,17H22V19H19V22H17V19H14V17H17V14H19V17Z"
				/>
			</svg>
			Select App
		</a>
	{/if}
</article>
