<script lang="ts">
	import { CellStateImage, filterState } from '@cell-wall/cell-state';
	import { getFrameContext } from './__layout.svelte';

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

	$: src = imageState?.src;
	$: fit = objectFit(imageState?.scaleType);
</script>

<img {src} alt="" style={`object-fit: ${fit}`} />

<style>
	img {
		display: block;
		height: 100vh;
		width: 100vh;
	}
</style>
