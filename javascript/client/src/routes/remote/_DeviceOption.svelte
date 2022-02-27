<script lang="ts">
	import type { CellData } from '@cell-wall/cell-state';

	export let device: CellData;
</script>

<option value={device.serial} disabled={!device.connected}>
	{device.info?.deviceName || device.serial}
</option>
