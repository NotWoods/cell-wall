import { blankState, CellData, CellInfo, CellState, ConnectionType } from '@cell-wall/shared';
import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';
import type { DeviceMap } from '../android/device-manager';
import { withLastState } from '../store/changes';
import { computeInfo } from './known';
import type { WebSocketInfo } from './socket-store';

function equalConnectionArrays(
	a: readonly ConnectionType[],
	b: readonly ConnectionType[]
): boolean {
	if (a.length !== b.length) {
		return false;
	}

	const aSet = new Set(a);
	return b.every((type) => aSet.has(type));
}

function deriveCellInfo(stores: {
	info: Readable<ReadonlyMap<string, CellInfo>>;
	devices: Readable<DeviceMap>;
	webSockets: Readable<ReadonlyMap<string, WebSocketInfo>>;
}): Readable<ReadonlyMap<string, CellInfo>> {
	let lastResult: ReadonlyMap<string, CellInfo> = new Map();
	return derived(
		[stores.info, stores.devices, stores.webSockets],
		([infoMap, devices, webSockets]) => {
			const cellInfoMap = new Map<string, CellInfo>();

			function mergeFrom<T>(
				otherMap: ReadonlyMap<string, T>,
				getCellInfo: (otherData: T) => Partial<CellInfo>
			) {
				for (const [serial, otherData] of otherMap) {
					const existing = cellInfoMap.get(serial) ?? {};
					const newData: CellInfo = {
						serial,
						...existing,
						...getCellInfo(otherData)
					};
					cellInfoMap.set(serial, newData);
				}
			}

			mergeFrom(infoMap, (info) => info);
			mergeFrom(webSockets, (socketInfo) => ({
				width: socketInfo.width,
				height: socketInfo.height
			}));
			mergeFrom(devices, ({ model, manufacturer }) => computeInfo(model, manufacturer));

			// Revert instance changes if new info is same as old info
			for (const [serial, newInfo] of cellInfoMap) {
				const lastInfo = lastResult.get(serial);
				if (
					lastInfo &&
					lastInfo.deviceName === newInfo.deviceName &&
					lastInfo.width === newInfo.width &&
					lastInfo.height === newInfo.height &&
					lastInfo.x === newInfo.x &&
					lastInfo.y === newInfo.y &&
					lastInfo.server === newInfo.server
				) {
					cellInfoMap.set(serial, lastInfo);
				}
			}

			lastResult = cellInfoMap;
			return lastResult;
		}
	);
}

function deriveConnection(stores: {
	devices: Readable<DeviceMap>;
	webSockets: Readable<ReadonlyMap<string, WebSocketInfo>>;
}): Readable<ReadonlyMap<string, readonly ConnectionType[]>> {
	return derived([stores.devices, stores.webSockets], ([devices, webSockets]) => {
		const connections = new Map<string, ConnectionType[]>();

		for (const id of webSockets.keys()) {
			connections.set(id, ['web']);
		}
		for (const serial of devices.keys()) {
			const array = connections.get(serial) ?? [];
			array.push('android');
			connections.set(serial, array);
		}

		return connections;
	});
}

export function deriveCellData(stores: {
	info: Readable<ReadonlyMap<string, CellInfo>>;
	state: Readable<ReadonlyMap<string, CellState>>;
	devices: Readable<DeviceMap>;
	webSockets: Readable<ReadonlyMap<string, WebSocketInfo>>;
}): Readable<ReadonlyMap<string, CellData>> {
	const cellInfo = deriveCellInfo(stores);
	const connections = deriveConnection(stores);

	const cellDataMap = derived(
		[stores.state, cellInfo, connections],
		([stateMap, infoMap, connectionMap]) => {
			const keys = new Set([...stateMap.keys(), ...infoMap.keys(), ...connectionMap.keys()]);

			return new Map<string, CellData>(
				Array.from(keys).map((serial) => {
					const newData: CellData = {
						info: infoMap.get(serial),
						state: stateMap.get(serial) ?? blankState,
						connection: connectionMap.get(serial) ?? []
					};

					return [serial, newData];
				})
			);
		}
	);

	return derived(withLastState(cellDataMap), ([result, lastResult]) => {
		return new Map(
			Array.from(result.entries()).map(([serial, newData]) => {
				const oldData = lastResult?.get(serial);

				// Don't change the object instance if data is the same
				if (
					oldData &&
					newData.info === oldData.info &&
					newData.state === oldData.state &&
					equalConnectionArrays(newData.connection, oldData.connection)
				) {
					return [serial, oldData];
				} else {
					return [serial, newData];
				}
			})
		);
	});
}
