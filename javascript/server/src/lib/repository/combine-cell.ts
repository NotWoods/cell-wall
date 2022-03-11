import type { CellData, CellInfo, CellState } from '@cell-wall/cell-state';
import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import type { DeviceMap } from '../android/device-manager';
import { computeInfo } from './known';
import type { WebSocketInfo } from './socket-store';

export function deriveCellInfo(stores: {
	info: Readable<ReadonlyMap<string, CellInfo>>;
	state: Readable<ReadonlyMap<string, CellState>>;
	devices: Readable<DeviceMap>;
	webSockets: Readable<ReadonlyMap<string, WebSocketInfo>>;
}): Readable<ReadonlyMap<string, CellData>> {
	return derived(
		[stores.info, stores.state, stores.devices, stores.webSockets],
		([infoMap, states, devices, webSockets]) => {
			const cellInfoMap = new Map<string, CellData>();

			function setFrom<T>(
				otherMap: ReadonlyMap<string, T>,
				getCellData: (
					otherData: T,
					existingData: Partial<CellData>,
					serial: string
				) => Partial<CellData>
			) {
				for (const [serial, otherData] of otherMap) {
					const existing = cellInfoMap.get(serial) ?? {};
					const newData: CellData = {
						serial,
						...existing,
						...getCellData(otherData, existing, serial)
					};
					cellInfoMap.set(serial, newData);
				}
			}

			setFrom(infoMap, (info) => ({ info }));

			setFrom(states, (state) => ({ state }));

			setFrom(webSockets, (connection, { info: existingInfo = {} }, serial) => ({
				connection: 'web',
				info: { serial, ...connection, ...existingInfo }
			}));

			setFrom(devices, ({ model, manufacturer }, { info: existingInfo = {} }, serial) => ({
				connection: 'android',
				info: { ...computeInfo(serial, model, manufacturer), ...existingInfo }
			}));

			return cellInfoMap;
		}
	);
}
