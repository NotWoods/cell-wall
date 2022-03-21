<script>
	import { blur } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let key = '';

	const pageTransitionDuration = 300;
</script>

{#key key}
	<div class="layout" in:blur={{ duration: pageTransitionDuration, easing: quintOut }}>
		<slot />
	</div>
{/key}

<style>
	.layout {
		height: 100vh;
		height: 100dvh;
		width: 100vw;
		background: #429a46;
	}
</style>
