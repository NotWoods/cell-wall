<script lang="ts">
	export let title: string;
	export let large = false;
	export let preset: string | undefined = undefined;
	export let formAction: string | undefined = undefined;
	export let button = 'Activate';
</script>

<article class="tile card is-child">
	<header class="card-header">
		<h3 class="card-header-title" class:title={large}>{title}</h3>
	</header>
	<div class="card-content">
		<slot />
	</div>
	<footer class="card-footer">
		<button
			type="submit"
			name="preset"
			value={preset}
			formaction={formAction}
			class="card-footer-item"
		>
			{button}
		</button>
	</footer>
</article>

<style>
	button.card-footer-item {
		background: none;
		border: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
	}
</style>
