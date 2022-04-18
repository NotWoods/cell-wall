<script lang="ts" context="module">
	import type { CellInfo, RectangleWithPosition } from '@cell-wall/shared';

	function drawCanvas(
		ctx: CanvasRenderingContext2D | undefined,
		scale: number,
		rects: readonly (CellInfo & RectangleWithPosition)[]
	) {
		if (!ctx) return;

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.font = '20px sans-serif';
		for (const info of rects) {
			const { x, y, width, height } = applyScale(info, scale);
			ctx.fillStyle = '#EFEFEF';
			ctx.fillRect(x, y, width, height);

			ctx.fillStyle = '#1b5e20';
			ctx.fillText(info.deviceName || info.serial, x + 10, y + 30, width - 20);
		}
	}
</script>

<script lang="ts">
	import { applyScale, fitScale } from '$lib/canvas/fit-scale';
	import { cellCanvas } from '@cell-wall/shared';

	export let rects: readonly (CellInfo & RectangleWithPosition)[] = [];

	let canvas: HTMLCanvasElement;
	$: ctx = canvas?.getContext('2d') ?? undefined;

	$: cellCanvasRect = cellCanvas(rects);
	$: scale = canvas ? fitScale(canvas, cellCanvasRect) : 1;

	$: {
		drawCanvas(ctx, scale, rects);
	}
</script>

<canvas
	class="fill shadow shadow-green-900 rounded-lg border-8"
	bind:this={canvas}
	height="700"
	width="1200"
/>

<style>
	canvas {
		border-color: #1b5e20;
		background-color: #429a46;
	}
</style>
