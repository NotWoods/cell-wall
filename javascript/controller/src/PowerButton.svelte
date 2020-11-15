<script lang="ts">
  export let serial: string;
  export let value: boolean;

  const props = {
    type: 'button',
    name: 'on',
    value: value.toString(),
  };

  let loading: Promise<void> = Promise.resolve();

  async function setPower() {
    const res = await fetch(`/v3/device/power/${serial}`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        on: value,
      }),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }
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
