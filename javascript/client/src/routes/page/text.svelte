<script lang="ts" context="module">
	export const router = false;
	export const prerender = true;
</script>

<script lang="ts">
	import { page } from '$app/stores';

	$: text = $page.url.searchParams.get('text') || 'CellWall';
	$: backgroundColor = $page.url.searchParams.get('backgroundColor') || '#429A46';
</script>

<main style="background: {backgroundColor};">
	<h1 class="headline-1">{text}</h1>
</main>

<style>
	main {
		display: flex;
		height: 100vh;
		align-items: center;
	}
	h1 {
		margin: 8px;
	}
</style>
