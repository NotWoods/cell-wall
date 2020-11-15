<script lang="ts">
  import { startCase } from 'lodash-es';
  import { createEventDispatcher } from 'svelte';
  import { getTypeFromSchema } from '@cell-wall/cells';
  import type { CellStateJsonSchema } from '@cell-wall/cells';

  const dispatch = createEventDispatcher();

  export let selected: string;
  export let schema: CellStateJsonSchema;
  $: type = getTypeFromSchema(schema);
  $: typeName = startCase(type.toLocaleLowerCase());

  function handleClick() {
    dispatch('click', type);
  }
</script>

<li class:is-active={type === selected} on:click={handleClick}>
  <!-- svelte-ignore a11y-missing-attribute -->
  <a data-type={type}>{typeName}</a>
</li>
