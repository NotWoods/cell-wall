<script lang="ts">
	import { createBlobUrlFactory } from '$lib/blob';
	import { type CellStateImage, filterState } from '@cell-wall/cell-state';
	import { getFrameContext } from './__layout.svelte';

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

	const { state } = getFrameContext();
	$: imageState = filterState('IMAGE', $state);

	$: src = imageState ? createBlobUrl(imageState.payload) : undefined;
	$: fit = objectFit(imageState?.scaleType);
</script>

<img class="fill" {src} alt="" style={`object-fit: ${fit}`} />
