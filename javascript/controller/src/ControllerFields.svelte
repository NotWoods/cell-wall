<script lang="ts">
  import { startCase } from 'lodash-es';
  import type { CellStateJsonSchema } from '@cell-wall/cells';
  import Field from './Field.svelte';

  function getInputType(name: string, property: { type: string }) {
    if (name.endsWith('Color')) return 'color';
    if (name === 'url' || name === 'url') return 'url';
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
  $: properties = Object.entries(schema?.properties || {}).filter(
    ([name]) => name !== 'type',
  );
</script>

{#each properties as [name, property] (name)}
  <Field htmlFor="control-{name}" label={getInputName(name)}>
    <input
      id="control-{name}"
      class="input"
      {name}
      type={getInputType(name, property)}
      required={required.has(name)} />
  </Field>
{/each}
