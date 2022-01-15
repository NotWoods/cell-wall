<script lang="ts">
	import startCase from 'lodash.startcase';
	import type { CellStateJsonSchema } from '$lib/cells/schema';
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';

	function getInputType(
		name: string,
		property: { type: string; format?: string; enum?: readonly string[] }
	) {
		if (Array.isArray(property.enum)) return 'select';
		if (name.endsWith('Color')) return 'color';
		if (property.format === 'uri') return 'url';
		switch (property.type) {
			case 'number':
				return 'number';
			default:
				return 'text';
		}
	}

	function getInputName(name: string) {
		switch (name) {
			case 'url':
				return 'URL';
			case 'src':
				return 'Source';
			default:
				return startCase(name);
		}
	}

	export let schema: CellStateJsonSchema | undefined;
	$: required = new Set<string>(schema?.required || []);
	$: properties = Object.entries(schema?.properties || {})
		.filter(([name]) => name !== 'type')
		.map(([name, property]) => ({
			name,
			property,
			type: getInputType(name, property)
		}));
</script>

{#each properties as { name, type, property } (name)}
	<HorizontalField for="control-{name}" label={getInputName(name)} let:inputClassName>
		{#if Array.isArray(property.enum)}
			<select id="control-{name}" {name} class={inputClassName}>
				{#each property.enum as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		{:else}
			<input
				id="control-{name}"
				class={type === 'color' ? '' : inputClassName}
				{name}
				{type}
				required={required.has(name)}
			/>
		{/if}
	</HorizontalField>
{/each}
