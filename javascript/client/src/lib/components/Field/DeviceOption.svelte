<script lang="ts" context="module">
	import type { ConnectionType } from '@cell-wall/shared';

	/**
	 * Format connection array as a string
	 * @param connection
	 */
	export function connectionToString(connection: readonly ConnectionType[] | undefined) {
		if (connection && connection.length > 0) {
			return connection.join(', ');
		} else {
			return 'disconnected';
		}
	}
</script>

<script lang="ts">
	import type { CellData } from '@cell-wall/shared';

	export let serial: string;
	export let device: CellData;

	$: connection = connectionToString(device.connection);
</script>

<option value={serial}>
	{device.info?.deviceName || serial} ({connection})
</option>
