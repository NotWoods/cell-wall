<script lang="ts">
	import { post } from './_form';

	export let title: string;
	export let action: string;
	export let rest: 'ignore' | 'blank' | 'off';

	let loading: Promise<unknown> = Promise.resolve();

	async function onActivate() {
		loading = post(action, { rest });
	}
</script>

<form class="tile is-child box" {action} on:submit|preventDefault={onActivate}>
	<p class="title">{title}</p>
	<p class="subtitle">
		<slot />
	</p>
	<div class="buttons is-right">
		{#await loading}
			<button type="submit" class="button is-outlined is-primary is-loading">Loading</button>
		{:then _}
			<button type="submit" class="button is-outlined is-primary">Submit</button>
		{:catch _}
			<button type="submit" class="button is-outlined is-danger">Submit</button>
		{/await}
	</div>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
	}

	.buttons {
		margin-top: auto;
	}
</style>
