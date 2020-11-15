<script lang="ts">
  import TypeTab from './TypeTab.svelte';
  import Field from './Field.svelte';
  import {
    getTypeFromSchema,
    cellStateBlankSchema,
    cellStateWebSchema,
    cellStateTextSchema,
    cellStateImageSchema,
  } from '@cell-wall/cells';
  import type { CellInfo } from '@cell-wall/cells';

  function caps(name: string) {
    return name[0].toLocaleUpperCase() + name.slice(1).toLocaleLowerCase();
  }

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
  on:submit={handleSubmit}
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

  <div class="buttons has-addons">
    <button
      type="submit"
      formaction="/v3/device/power"
      class="button"
      name="on"
      value="false">Off</button>
    <button
      type="submit"
      formaction="/v3/device/power"
      class="button"
      name="on"
      value="true">On</button>
  </div>

  {#each Object.entries(activeSchema.properties) as [name, property] (name)}
    <Field htmlFor="control-{name}" label={caps(name)}>
      <input
        id="control-{name}"
        class="input"
        {name}
        type={getInputType(name, property)}
        required={activeSchema.required.includes(name)} />
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
