<script lang="ts" context="module">
	import { cellCanvas, CellInfo, RectangleWithPosition } from '@cell-wall/shared';

	function getScale(
		canvas: HTMLCanvasElement | undefined,
		rects: readonly RectangleWithPosition[]
	) {
		if (!canvas) {
			return 1;
		}

		const { width, height } = cellCanvas(rects);
		const widthScale = canvas.width / width;
		const heightScale = canvas.height / height;
		return Math.min(widthScale, heightScale);
	}

	function drawCanvas(
		ctx: CanvasRenderingContext2D | undefined,
		scale: number,
		rects: readonly (CellInfo & RectangleWithPosition)[]
	) {
		if (!ctx) return;

		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.font = '20px sans-serif';
		for (const info of rects) {
			const { x, y, width, height } = info;
			ctx.fillStyle = '#EFEFEF';
			ctx.fillRect(x * scale, y * scale, width * scale, height * scale);

			ctx.fillStyle = '#1b5e20';
			ctx.fillText(
				info.deviceName || info.serial,
				x * scale + 10,
				y * scale + 30,
				width * scale - 20
			);
		}
	}
</script>

<script lang="ts">
	export let rects: readonly (CellInfo & RectangleWithPosition)[] = [];

	let canvas: HTMLCanvasElement;
	$: ctx = canvas?.getContext('2d') ?? undefined;

	$: scale = getScale(canvas, rects);

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
