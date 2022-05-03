<script context="module" lang="ts">
	import type { JsonSchemaProperty } from '@cell-wall/shared';
	import { RandomColor } from '@cell-wall/shared';

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
</script>

<script lang="ts">
	import HorizontalField from '$lib/components/Field/HorizontalField.svelte';
	import startCase from 'lodash.startcase';

	export let name: string;
	export let property: JsonSchemaProperty;
	export let required: boolean;
	export let value: unknown;

	$: label = property.title ?? startCase(name);
	$: type = getInputType(name, property);
	$: fallback = type === 'color' ? randomColor.next() : '';
	$: examples = property.examples && property.examples.length > 0 ? property.examples : undefined;
</script>

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
			list={examples ? `list-${name}` : undefined}
			class={type === 'color' ? '' : inputClassName}
			{name}
			{type}
			{required}
			value={typeof value === 'string' ? value : fallback}
		/>
		{#if examples}
			<datalist id="list-{name}">
				{#each examples as example}
					<option value={example} />
				{/each}
			</datalist>
		{/if}
	{/if}
</HorizontalField>
