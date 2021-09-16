<script lang="ts">
	export let title: string;
	export let preset: string;
</script>

<article class="tile is-child box">
	<p class="title">{title}</p>
	<p class="subtitle">
		<slot />
	</p>
	<div class="buttons is-right">
		<button type="submit" name="preset" value={preset} class="button is-outlined">Activate</button>
	</div>
</article>

<style>
	article {
		display: flex;
		flex-direction: column;
	}

	.buttons {
		margin-top: auto;
	}
</style>
