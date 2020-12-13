<script lang="ts">
  import type { CellInfo } from '@cell-wall/cells';
  import NavBar from './NavBar.svelte';
  import Custom from './page/Custom.svelte';
  import Image from './page/Image.svelte';
  import Preset from './page/Preset.svelte';
  import { hash } from './stores';

  export let devices: { serial: string; info: CellInfo }[];

  const options: Record<string, any> = {
    '#custom': Custom,
    '#image': Image,
    '#preset': Preset,
  };
</script>

<NavBar />

<main class="section">
  <div class="container">
    <svelte:component this={options[$hash] || Custom} {devices} />
  </div>
</main>
