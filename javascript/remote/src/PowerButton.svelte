<script lang="ts">
  import { post } from './post';

  export let serial: string;
  export let value: boolean;

  const props = {
    type: 'button',
    name: 'on',
    value: value.toString(),
  };

  let loading: Promise<void> = Promise.resolve();

  async function setPower() {
    await post(`/v3/device/power/${serial}`, {
      on: value,
    });
  }
</script>

{#await loading}
  <button
    {...props}
    class="button is-loading"
    on:click={() => {
      loading = setPower();
    }}>
    <slot />
  </button>
{:then _}
  <button
    {...props}
    class="button"
    on:click={() => {
      loading = setPower();
    }}>
    <slot />
  </button>
{:catch _}
  <button
    {...props}
    class="button is-danger"
    on:click={() => {
      loading = setPower();
    }}>
    <slot />
  </button>
{/await}
