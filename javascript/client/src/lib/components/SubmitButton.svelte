<script lang="ts">
	export let loading: Promise<void>;
</script>

<p class="control">
	{#await loading}
		<button type="submit" class="button is-primary is-loading">Loading</button>
	{:then _}
		<button type="submit" class="button is-primary">Submit</button>
	{:catch _}
		<button type="submit" class="button is-danger">Submit</button>
	{/await}
</p>
