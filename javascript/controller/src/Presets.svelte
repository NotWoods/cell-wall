<script lang="ts">
  import { post } from './post';

  let panelOpen = false;
  let loading: Promise<object | undefined> = Promise.resolve(undefined);

  function open() {
    panelOpen = true;
  }

  function close() {
    panelOpen = false;
  }

  async function callPreset(event: Event) {
    const anchor = (event.target as HTMLElement).closest('a');
    if (!anchor) return;
    event.preventDefault();

    return await post(anchor.href, {});
  }
</script>

<p class="control" style="margin-right: auto">
  <button
    type="button"
    class="button is-light is-outlined"
    aria-target="modal"
    aria-haspopup="true"
    on:click={open}>Presets</button>
</p>

<div id="modal" class="modal" class:is-active={panelOpen}>
  <div class="modal-background" on:click={close} aria-hidden={!panelOpen} />
  <div
    class="modal-content panel"
    role="dialog"
    aria-labelledby="modalHeading"
    style="background-color: #1f2424"
    on:click={(event) => {
      loading = callPreset(event);
    }}>
    <p id="modalHeading" class="panel-heading">Presets</p>

    <a class="panel-block" href="/v3/device/state/presets/info">
      Info (Busy indicators & Weather)
    </a>
    <a class="panel-block" href="/v3/device/state/presets/tea"> Tea List </a>

    <div class="panel-block">
      {#await loading}
        <progress
          class="progress is-small is-primary"
          max="100">Loading</progress>
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
    </div>
  </div>
  <button class="modal-close is-large" aria-label="close" on:click={close} />
</div>
