<script lang="ts">
	import startCase from 'lodash.startcase';
	import type { CellStateJsonSchema } from '$lib/cells/schema';
	import Field from '../../../lib/components/Field.svelte';

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
	<Field htmlFor="control-{name}" label={getInputName(name)} narrow={type === 'color'}>
		{#if Array.isArray(property.enum)}
			<div class="select">
				<select id="control-{name}" {name}>
					{#each property.enum as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>
		{:else}
			<input id="control-{name}" class="input" {name} {type} required={required.has(name)} />
		{/if}
	</Field>
{/each}
