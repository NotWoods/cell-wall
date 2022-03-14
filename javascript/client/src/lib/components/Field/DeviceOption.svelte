<script lang="ts">
	import type { CellData } from '@cell-wall/cell-state';

	export let device: CellData;
</script>

<option value={device.serial}>
	{device.info?.deviceName || device.serial} ({device.connection ?? 'disconnected'})
</option>
