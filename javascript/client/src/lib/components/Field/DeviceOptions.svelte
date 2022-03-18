<script lang="ts">
	import type { CellData } from '@cell-wall/shared';
	import DeviceOption from './DeviceOption.svelte';

	export let devices: readonly [string, CellData][];
</script>

{#each devices as [serial, device] (serial)}
	<DeviceOption {serial} {device} />
{/each}
