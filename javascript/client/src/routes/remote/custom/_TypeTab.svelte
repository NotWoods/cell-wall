<script lang="ts">
	import startCase from 'lodash.startcase';
	import { CellStateJsonSchema, getTypeFromSchema } from '$lib/cells/schema';

	export let selectedType: string;
	export let schema: CellStateJsonSchema;
	$: type = getTypeFromSchema(schema);
	$: typeName = startCase(type.toLocaleLowerCase());
</script>

<li class:is-active={type === selectedType} on:click={() => { selectedType = type }}>
	<!-- svelte-ignore a11y-missing-attribute -->
	<a data-type={type}>{typeName}</a>
</li>
