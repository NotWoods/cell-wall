<script lang="ts">
	import { createBlobUrlFactory } from '$lib/blob';
	import { filterState } from '$lib/filter-state';
	import type { CellStateImage } from '@cell-wall/shared';
	import { frameContext } from '../context';

	const createBlobUrl = createBlobUrlFactory();
	function objectFit(fit: CellStateImage['scaleType']) {
		switch (fit) {
			case 'FIT_CENTER':
			case undefined:
				return 'contain';
			case 'FIT_XY':
				return 'fill';
			case 'CENTER_INSIDE':
				return 'cover';
		}
	}

	const imageState = filterState('IMAGE', frameContext.state);

	$: src = $imageState ? createBlobUrl($imageState.payload) : undefined;
	$: fit = objectFit($imageState?.scaleType);
</script>

<img class="fill" {src} alt="" style="object-fit: {fit}" />

<style>
	img {
		background: black;
	}
</style>
