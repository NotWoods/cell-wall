import type { CellInfo, CellData, CellState } from '@cell-wall/cell-state';
import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import type { DeviceMap } from '../android/device-manager';
import { computeInfo } from './known';

export function deriveCellInfo(stores: {
	info: Readable<ReadonlyMap<string, CellInfo>>;
	state: Readable<ReadonlyMap<string, CellState>>;
	devices: Readable<DeviceMap>;
}): Readable<ReadonlyMap<string, CellData>> {
	return derived(
		[stores.info, stores.state, stores.devices],
		([infoMap, states, devices]) => {
			const cellInfoMap = new Map<string, CellData>();
			for (const [serial, info] of infoMap) {
				cellInfoMap.set(serial, { serial, info, connected: false });
			}
			for (const [serial, state] of states) {
				const existing = cellInfoMap.get(serial);
				if (existing) {
					existing.state = state;
				} else {
					cellInfoMap.set(serial, { serial, state, connected: false });
				}
			}
			for (const [serial, { model, manufacturer }] of devices) {
				const existing = cellInfoMap.get(serial);
				if (existing) {
					existing.connected = true;
					existing.info = {
						...computeInfo(serial, model, manufacturer),
						...existing.info
					};
				} else {
					cellInfoMap.set(serial, {
						serial,
						connected: true,
						info: computeInfo(serial, model, manufacturer)
					});
				}
			}
			return cellInfoMap;
		},
		new Map()
	);
}
