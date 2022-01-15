<script lang="ts">
	import startCase from 'lodash.startcase';
	import { CellStateJsonSchema, getTypeFromSchema } from '$lib/cells/schema';
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
