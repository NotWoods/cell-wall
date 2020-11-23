<script lang="ts">
  import { post } from '../post';
  import PresetCard from '../PresetCard.svelte';

  let loading: Promise<unknown> = Promise.resolve();

  async function onActivate(event: CustomEvent<string>) {
    const action = event.detail;
    loading = post(action, {});
  }
</script>

{#await loading}
  <progress class="progress is-small is-primary" max="100">Loading</progress>
{:then res}
  <progress
    class="progress is-small is-primary"
    value={res != undefined ? '100' : '0'}
    max="100">Done</progress>
{:catch _}
  <progress
    class="progress is-small is-danger"
    value="100"
    max="100">Error</progress>
{/await}

<div class="tile is-ancestor">
  <div class="tile is-parent is-vertical">
    <PresetCard
      title="Info"
      action="/v3/device/state/presets/info"
      on:activate={onActivate}>
      Calendar indicators and the week's weather.
    </PresetCard>
    <PresetCard
      title="Tea list"
      action="/v3/device/state/presets/tea"
      on:activate={onActivate}>
      What's avaliable to drink?
    </PresetCard>
  </div>
  <div class="tile is-parent">
    <article class="tile is-child notification">
      <figure class="image">
        <img
          src="https://raw.githubusercontent.com/NotWoods/cell-wall/main/images/finished.jpg" />
      </figure>
    </article>
  </div>
</div>
