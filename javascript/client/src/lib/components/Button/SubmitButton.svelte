<script lang="ts" context="module">
	const DEFAULT_COLORS = {
		pending: 'bg-green-500',
		success: 'bg-green-500 hover:bg-green-600',
		error: 'bg-red-500'
	};
</script>

<script lang="ts">
	import LoadingSpinner from '../LoadingSpinner.svelte';
	import Button from './Button.svelte';

	export let loading: PromiseLike<void>;
	let className = '';
	export { className as class };
	export let colors: Partial<typeof DEFAULT_COLORS> = {};
</script>

{#await loading}
	<Button
		{...$$restProps}
		type="submit"
		class="{className} relative {colors.pending ?? DEFAULT_COLORS.pending}"
		on:click
	>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<LoadingSpinner />
		</div>
		<span class="text-transparent" aria-hidden="true"><slot>Submit</slot></span>
	</Button>
{:then _}
	<Button
		{...$$restProps}
		type="submit"
		class="{className} relative {colors.success ?? DEFAULT_COLORS.success}"
		on:click
	>
		<slot>Submit</slot>
	</Button>
{:catch _}
	<Button
		{...$$restProps}
		type="submit"
		class="{className} relative {colors.error ?? DEFAULT_COLORS.error}"
		on:click
	>
		<slot>Submit</slot>
	</Button>
{/await}
