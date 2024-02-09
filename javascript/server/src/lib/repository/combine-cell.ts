import type { CellData, CellInfo, CellState, ConnectionType } from '@cell-wall/shared';
import { blankState } from '@cell-wall/shared';
import { derived, type Readable } from 'svelte/store';
import type { AndroidProperties } from '@cell-wall/android-device-manager';
import { transformMap } from '@notwoods/webish';
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
	database: Readable<ReadonlyMap<string, CellInfo>>;
	androidProperties: Readable<ReadonlyMap<string, AndroidProperties>>;
	webSockets: Readable<ReadonlyMap<string, WebSocketInfo>>;
}): Readable<ReadonlyMap<string, CellInfo>> {
	let lastResult: ReadonlyMap<string, CellInfo> = new Map();
	return derived(
		[stores.database, stores.androidProperties, stores.webSockets],
		([$database, $androidProps, $webSocketInfo]) => {
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

			mergeFrom($webSocketInfo, (socketInfo) => ({
				width: socketInfo.width,
				height: socketInfo.height,
				server: socketInfo.url.origin
			}));
			mergeFrom($androidProps, ({ model, manufacturer }) => computeInfo(model, manufacturer));
			mergeFrom($database, (info) => info);

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
	androidProperties: Readable<ReadonlyMap<string, unknown>>;
	webSockets: Readable<ReadonlyMap<string, WebSocketInfo>>;
}): Readable<ReadonlyMap<string, readonly ConnectionType[]>> {
	return derived(
		[stores.androidProperties, stores.webSockets],
		([$androidProps, $webSocketInfo]) => {
			const connections = new Map<string, ConnectionType[]>();

			for (const id of $webSocketInfo.keys()) {
				connections.set(id, ['web']);
			}
			for (const serial of $androidProps.keys()) {
				const array = connections.get(serial) ?? [];
				array.push('android');
				connections.set(serial, array);
			}

			return connections;
		}
	);
}

export function deriveCellData(stores: {
	database: Readable<ReadonlyMap<string, CellInfo>>;
	state: Readable<ReadonlyMap<string, CellState>>;
	androidProperties: Readable<ReadonlyMap<string, AndroidProperties>>;
	webSockets: Readable<ReadonlyMap<string, WebSocketInfo>>;
}): Readable<ReadonlyMap<string, CellData>> {
	const cellInfo = deriveCellInfo(stores);
	const connections = deriveConnection(stores);

	const cellDataMap = derived(
		[stores.state, cellInfo, connections],
		([$states, $infos, $connections]) => {
			const keys = new Set([...$states.keys(), ...$infos.keys(), ...$connections.keys()]);

			return new Map<string, CellData>(
				Array.from(keys).map((serial) => {
					const newData: CellData = {
						info: $infos.get(serial),
						state: $states.get(serial) ?? blankState,
						connection: $connections.get(serial) ?? []
					};

					return [serial, newData];
				})
			);
		}
	);

	return derived(withLastState(cellDataMap), ([result, lastResult]) => {
		return transformMap(result, (newData, serial) => {
			const oldData = lastResult?.get(serial);

			// Don't change the object instance if data is the same
			if (
				oldData &&
				newData.info === oldData.info &&
				newData.state === oldData.state &&
				equalConnectionArrays(newData.connection, oldData.connection)
			) {
				return oldData;
			} else {
				return newData;
			}
		});
	});
}
