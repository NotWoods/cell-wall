<script lang="ts">
  import { startCase } from 'lodash-es';
  import {
    getTypeFromSchema,
    cellStateBlankSchema,
    cellStateWebSchema,
    cellStateTextSchema,
    cellStateImageSchema,
  } from '@cell-wall/cells';
  import type { CellInfo } from '@cell-wall/cells';
  import TypeTab from './TypeTab.svelte';
  import Field from './Field.svelte';
  import PowerButton from './PowerButton.svelte';

  function getInputType(name: string, property: { type: string }) {
    if (name.endsWith('Color')) return 'color';
    if (name === 'url') return 'url';
    switch (property.type) {
      case 'number':
        return 'number';
      default:
        return 'text';
    }
  }

  export let devices: { serial: string; info: CellInfo }[];

  const types = [
    cellStateBlankSchema,
    cellStateWebSchema,
    cellStateTextSchema,
    cellStateImageSchema,
  ];
  let selectedType = 'BLANK';
  let selectedDevice = '';
  let form: HTMLFormElement;
  let loading: Promise<void> = Promise.resolve();

  $: activeSchema = types.find(
    (schema) => getTypeFromSchema(schema) === selectedType,
  );
  $: required = new Set<string>(activeSchema?.required || []);
  $: properties = Object.entries(activeSchema!.properties).filter(
    ([name]) => name !== 'type',
  );

  function handleSelect(event: CustomEvent<string>) {
    selectedType = event.detail;
  }

  interface SubmitEvent extends Event {
    readonly submitter: HTMLElement;
  }

  function handleSubmit(event: Event) {
    const { submitter } = event as SubmitEvent;
    const { formAction = form.action } = submitter as HTMLButtonElement;

    loading = submit(formAction);
  }

  async function submit(action: string) {
    const formData = Array.from(new FormData(form))
      // no files allowed
      .filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string',
      )
      // nor empty strings
      .filter(([_, value]) => value)
      // parse booleans
      .map(([key, value]) => (key === 'on' ? JSON.parse(value) : value));
    const data = Object.fromEntries(formData);

    const res = await fetch(`${action}/${selectedDevice}`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        type: selectedType,
      }),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css" />
</svelte:head>

<main class="container">
  <nav class="tabs is-centered">
    <ul>
      {#each types as schema (schema.properties.type.enum[0])}
        <TypeTab selected={selectedType} {schema} on:click={handleSelect} />
      {/each}
    </ul>
  </nav>

  <form
    method="post"
    action="/v3/device/state"
    on:submit|preventDefault={handleSubmit}
    bind:this={form}>
    <Field htmlFor="control-serial" label="Device">
      <div class="select">
        <select bind:value={selectedDevice} id="control-serial">
          <option value="">All devices</option>
          {#each devices as device (device.serial)}
            <option value={device.serial}>
              {device.info.deviceName || device.serial}
            </option>
          {/each}
        </select>
      </div>
    </Field>

    <div class="field is-horizontal">
      <div class="field-label is-normal"><span class="label">Power</span></div>
      <div class="field-body">
        <div class="buttons has-addons">
          <PowerButton value="false">Off</PowerButton>
          <PowerButton value="true">On</PowerButton>
        </div>
      </div>
    </div>

    {#each properties as [name, property] (name)}
      <Field htmlFor="control-{name}" label={startCase(name)}>
        <input
          id="control-{name}"
          class="input"
          {name}
          type={getInputType(name, property)}
          required={required.has(name)} />
      </Field>
    {/each}

    <div class="field is-grouped is-grouped-right">
      <p class="control">
        <button type="reset" class="button is-light">Reset</button>
      </p>
      <p class="control">
        {#await loading}
          <button
            type="submit"
            class="button is-primary is-loading">Loading</button>
        {:then _}
          <button type="submit" class="button is-primary">Submit</button>
        {:catch _}
          <button type="submit" class="button is-danger">Submit</button>
        {/await}
      </p>
    </div>
  </form>
</main>
