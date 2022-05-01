<script>
	import { fade, slide } from 'svelte/transition';
	import { quintIn } from 'svelte/easing';

	const pageTransitionDuration = 300;
</script>

<div
	class="layout"
	in:slide={{ duration: pageTransitionDuration, easing: quintIn }}
	out:fade={{ delay: pageTransitionDuration, duration: 50 }}
>
	<slot />
</div>

<style>
	.layout {
		height: 100vh;
		height: 100dvh;
		width: 100vw;
		background: #429a46;
	}
</style>
