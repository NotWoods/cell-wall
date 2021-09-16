<script lang="ts">
	import startCase from 'lodash-es/startCase';
	import { createEventDispatcher } from 'svelte';
	import { CellStateJsonSchema, getTypeFromSchema } from '$lib/cells/schema';

	const dispatch = createEventDispatcher();

	export let selected: string;
	export let schema: CellStateJsonSchema;
	$: type = getTypeFromSchema(schema);
	$: typeName = startCase(type.toLocaleLowerCase());

	function handleClick() {
		dispatch('click', type);
	}
</script>

<li class:is-active={type === selected} on:click={handleClick}>
	<!-- svelte-ignore a11y-missing-attribute -->
	<a data-type={type}>{typeName}</a>
</li>
