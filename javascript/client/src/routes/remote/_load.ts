import type { CellData } from '$lib/cells';
import type { Load } from '@sveltejs/kit';

export interface Props {
	devices: readonly CellData[];
}

export function createLoadWithDevices(): Load {
	return async ({ fetch }) => {
		const res = await fetch(`/api/device/`);
		if (res.ok) {
			return {
				props: {
					devices: Object.values(await res.json())
				}
			};
		} else {
			return {
				status: res.status,
				error: new Error(`Could not load devices, ${res.statusText}`)
			};
		}
	};
}