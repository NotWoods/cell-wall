<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ page }) => ({
		props: {
			text: page.query.get('text'),
			backgroundColor: page.query.get('backgroundColor')
		}
	});
</script>

<script lang="ts">
	export let text = 'CellWall';
	export let backgroundColor = '#429A46';
</script>

<main style="background: {backgroundColor};">
	<h1 class="headline-1">{text}</h1>
</main>

<style>
	main {
		display: flex;
	}
	h1 {
		margin: 8px;
	}
</style>
