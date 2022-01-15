<script lang="ts">
	import LoadingSpinner from './LoadingSpinner.svelte';

	const SHARED_CLASSES =
		'px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white';

	export let loading: Promise<void>;
	let className = '';
	export { className as class };
</script>

{#await loading}
	<button {...$$restProps} type="submit" class="{SHARED_CLASSES} {className} bg-green-500">
		<LoadingSpinner />
	</button>
{:then _}
	<button
		{...$$restProps}
		type="submit"
		class="{SHARED_CLASSES} {className} bg-green-500 hover:bg-green-600"><slot>Submit</slot></button
	>
{:catch _}
	<button {...$$restProps} type="submit" class="{SHARED_CLASSES} {className} bg-red-500"
		><slot>Submit</slot></button
	>
{/await}
