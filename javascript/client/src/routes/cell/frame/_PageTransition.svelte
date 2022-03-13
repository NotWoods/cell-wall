<script>
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let url = '';

	const pageTransitionDuration = 300;
</script>

{#key url}
	<div
		class="layout"
		in:slide={{ duration: pageTransitionDuration, easing: quintOut }}
		out:slide={{ duration: pageTransitionDuration, easing: quintOut }}
	>
		<slot />
	</div>
{/key}

<style>
	.layout {
		height: 100vh;
		height: 100dvh;
		width: 100vw;
	}
</style>
