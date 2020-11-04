<script lang="ts">
  const devicePromise = (async () => {
    type Power = Record<string, { on: boolean }>;

    const res = await fetch('/v3/device/power');
    const { devices } = await res.json();
    return devices as Power;
  })();

  function powerOn(on: boolean) {
    return async () => {
      await fetch(`/v3/device/power`, {
        method: 'POST',
        body: JSON.stringify({ on }),
      });
    };
  }
</script>

<h1>Devices</h1>

{#await devicePromise then devices}
  <ul>
    {#each Object.entries(devices) as [serial, device] (serial)}
      <li>{serial} ({device.on ? 'On' : 'Off'})</li>
    {/each}
  </ul>
{/await}

<div><button type="button" on:click={powerOn(false)}>Power Off</button></div>
<div><button type="button" on:click={powerOn(true)}>Power On</button></div>
