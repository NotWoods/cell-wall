<script lang="ts">
	import type { CellState, CellStateJsonSchema } from '@cell-wall/shared';
	import ControllerField from './_ControllerField.svelte';

	export let schema: CellStateJsonSchema | undefined;
	export let state: CellState | undefined = undefined;

	$: required = new Set<string>(schema?.required || []);
	$: properties = Object.entries(schema?.properties || {})
		.filter(([name]) => name !== 'type')
		.map(([name, property]) => ({
			name: name as keyof CellState,
			property
		}));
</script>

{#each properties as { name, property } (name)}
	<ControllerField {name} {property} required={required.has(name)} value={state?.[name]} />
{/each}
