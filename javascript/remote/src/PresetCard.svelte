<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let title: string;
  export let action: string;

  function handleClick() {
    dispatch('activate', action);
  }
</script>

<article
  class="tile is-child box"
  style="display: flex; flex-direction: column">
  <p class="title">{title}</p>
  <p class="subtitle">
    <slot />
  </p>
  <div class="buttons is-right" style="margin-top: auto">
    <button class="button is-outlined" on:click={handleClick}>Activate</button>
  </div>
</article>
