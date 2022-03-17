<script lang="ts">
	import startCase from 'lodash.startcase';
	import { type CellStateJsonSchema, getTypeFromSchema } from '@cell-wall/shared';
	import Tab from '$lib/components/Tabs/Tab.svelte';

	export let selectedType: string;
	export let schema: CellStateJsonSchema;
	$: type = getTypeFromSchema(schema);
	$: typeName = startCase(type.toLocaleLowerCase());
</script>

<Tab
	selected={type === selectedType}
	controls="custom-form"
	on:click={() => {
		selectedType = type;
	}}
>
	{typeName}
</Tab>
