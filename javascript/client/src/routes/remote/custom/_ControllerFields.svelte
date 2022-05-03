<script lang="ts">
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';
	import type { JsonSchemaProperty } from '@cell-wall/shared';
	import { RandomColor, type CellState, type CellStateJsonSchema } from '@cell-wall/shared';
	import startCase from 'lodash.startcase';

	const randomColor = new RandomColor();
	function getInputType(name: string, property: JsonSchemaProperty) {
		if (Array.isArray(property.enum)) return 'select';
		if (name.endsWith('Color')) return 'color';
		switch (property.type) {
			case 'number':
				return 'number';
			case 'string':
				if (property.format === 'uri') return 'url';
			// fall through
			default:
				return 'text';
		}
	}

	export let schema: CellStateJsonSchema | undefined;
	export let state: CellState | undefined = undefined;

	$: required = new Set<string>(schema?.required || []);
	$: properties = Object.entries(schema?.properties || {})
		.filter(([name]) => name !== 'type')
		.map(([name, property]) => {
			const type = getInputType(name, property);
			return {
				name: name as keyof CellState,
				label: property.title ?? startCase(name),
				property,
				type,
				fallback: type === 'color' ? randomColor.next() : '',
				examples: property.examples ?? []
			};
		});
</script>

{#each properties as { name, label, type, property, fallback, examples } (name)}
	<HorizontalField for="control-{name}" {label} let:inputClassName>
		{#if Array.isArray(property.enum)}
			<select id="control-{name}" {name} class={inputClassName}>
				{#each property.enum as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		{:else}
			<input
				id="control-{name}"
				list={examples.length > 0 ? `list-${name}` : undefined}
				class={type === 'color' ? '' : inputClassName}
				{name}
				{type}
				required={required.has(name)}
				value={state?.[name] ?? fallback}
			/>
			{#if examples.length > 0}
				<datalist id="list-{name}">
					{#each examples as example}
						<option value={example} />
					{/each}
				</datalist>
			{/if}
		{/if}
	</HorizontalField>
{/each}
