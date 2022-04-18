<script lang="ts" context="module">
	import {
		CellData,
		CellInfo,
		Rectangle,
		RectangleWithPosition,
		validRect,
		validRectWithPos
	} from '@cell-wall/shared';

	function splitToBuckets(devices: ReadonlyMap<string, CellData>): {
		rectWithPos: readonly (CellInfo & RectangleWithPosition)[];
		rect: readonly (CellInfo & Rectangle)[];
		rest: readonly CellInfo[];
	} {
		const rectWithPos: (CellInfo & RectangleWithPosition)[] = [];
		const rect: (CellInfo & Rectangle)[] = [];
		const rest: CellInfo[] = [];

		for (const [serial, { info }] of devices) {
			if (!info) {
				rest.push({ serial });
				continue;
			}

			if (validRectWithPos(info)) {
				rectWithPos.push(info);
			} else if (validRect(info)) {
				rect.push(info);
			} else {
				rest.push(info);
			}
		}

		return { rectWithPos, rect, rest };
	}
</script>

<script lang="ts">
	import LinkButton from '$lib/components/Button/LinkButton.svelte';
	import RectCanvas from '$lib/components/RectCanvas.svelte';
	import { getRemoteContext } from './__layout.svelte';

	const { state: remoteState } = getRemoteContext();

	$: buckets = splitToBuckets($remoteState);
</script>

<svelte:head>
	<title>Canvas | CellWall</title>
</svelte:head>

<section class="fill">
	<RectCanvas rects={buckets.rectWithPos} />
	<div>
		<LinkButton href="/remote/edit">Edit Cells</LinkButton>
	</div>
	<aside class="mt-4">
		<div>
			<h2 class="font-bold">No X/Y</h2>
			<dl>
				{#each buckets.rect as info (info.serial)}
					<div>
						<dt>{info.serial}</dt>
						<dd>{info.width} x {info.height}</dd>
					</div>
				{/each}
			</dl>
		</div>
		<div>
			<h2 class="font-bold">No width/height</h2>
			<ul>
				{#each buckets.rest as info (info.serial)}
					<li>{info.serial}</li>
				{/each}
			</ul>
		</div>
	</aside>
</section>

<style>
	aside {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	dt,
	dd {
		display: inline;
	}
	dt::before,
	li::before {
		content: '- ';
	}
	dt::after {
		content: ': ';
	}
</style>
