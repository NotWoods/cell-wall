<script context="module" lang="ts">
	import { quintIn } from 'svelte/easing';
	import type { TransitionConfig } from 'svelte/transition';

	function fly(
		node: Element,
		{ duration = 400, x = 0, y = 0 }: { duration?: number; x?: number; y?: number } = {}
	): TransitionConfig {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			delay: 0,
			duration,
			easing: quintIn,
			css: (t) => `transform: ${transform} translate(${(1 - t) * x}%, ${(1 - t) * y}%);`
		};
	}

	const directions = {
		left: { x: -100, y: 0 },
		right: { x: 100, y: 0 },
		top: { x: 0, y: -100 },
		bottom: { x: 0, y: 100 }
	};
	const directionKeys = Object.keys(directions) as ReadonlyArray<keyof typeof directions>;
</script>

<script lang="ts">
	import { randomItem } from '@cell-wall/shared';
	import { fade } from 'svelte/transition';

	const pageTransitionDuration = 2000;
	const direction = directions[randomItem(directionKeys)];
</script>

<div
	class="inner fill"
	in:fly={{ duration: pageTransitionDuration, x: direction.x, y: direction.y }}
	out:fade={{ delay: pageTransitionDuration, duration: 50 }}
>
	<slot />
</div>

<style>
	.inner {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
