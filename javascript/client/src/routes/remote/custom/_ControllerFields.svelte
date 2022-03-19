<script lang="ts">
	import startCase from 'lodash.startcase';
	import { RandomColor, type CellState, type CellStateJsonSchema } from '@cell-wall/shared';
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';

	const randomColor = new RandomColor();
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

	export let schema: CellStateJsonSchema | undefined;
	export let state: CellState | undefined = undefined;

	$: getInputName = (name: string) => {
		if (name === 'payload') {
			const type = schema?.properties?.type?.enum?.[0];
			switch (type) {
				case 'WEB':
					return 'URL';
				case 'IMAGE':
					return 'Source';
				case 'TEXT':
					return 'Text';
				default:
					return startCase(name);
			}
		}
		return startCase(name);
	};

	$: required = new Set<string>(schema?.required || []);
	$: properties = Object.entries(schema?.properties || {})
		.filter(([name]) => name !== 'type')
		.map(([name, property]) => {
			const type = getInputType(name, property);
			return {
				name: name as keyof CellState,
				property,
				type,
				fallback: type === 'color' ? randomColor.next() : ''
			};
		});
</script>

{#each properties as { name, type, property, fallback } (name)}
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
				value={state?.[name] ?? fallback}
			/>
		{/if}
	</HorizontalField>
{/each}
