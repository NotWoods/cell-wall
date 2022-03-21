import type { CellInfo } from '@cell-wall/shared';
import type { Adapter } from 'lowdb';
import { JSONFile, Low, Memory } from 'lowdb';
import { get, writable, type Updater, type Writable } from 'svelte/store';
import type { Credentials } from './third-party-connect/google';

interface LowData {
	googleCredentials?: Credentials | undefined;
	cells: Record<string, CellInfo>;
}

export interface DatabaseStore extends Writable<LowData> {
	get(): Promise<LowData>;
	/**
	 * Set new powered devices and inform subscribers.
	 * @param value to set
	 * @returns Promise that resolves after power states are changed.
	 */
	set(this: void, value: LowData): Promise<void>;
	/**
	 * Update new powered devices using callback and inform subscribers.
	 * @param updater callback
	 * @returns Promise that resolves after power states are changed.
	 */
	update(this: void, updater: Updater<LowData>): Promise<void>;
}

export function database(filename?: string): DatabaseStore {
	const adapter: Adapter<LowData> = filename ? new JSONFile(filename) : new Memory();
	const db = new Low(adapter);

	const store = writable<LowData>({ cells: {} });

	const init = db.read().then(() => {
		db.data ||= { cells: {} };
		store.set(db.data);
	});

	async function update(updater: Updater<LowData>) {
		await init;
		store.update((oldData) => {
			const newData = updater(oldData);
			db.data = newData;
			return newData;
		});
		await db.write();
	}

	return {
		subscribe: store.subscribe,
		update,
		async get() {
			await init;
			return get(store);
		},
		set(value) {
			return update(() => value);
		}
	};
}

export function addCellInfo(serial: string, newInfo: Partial<CellInfo>) {
	return (data: LowData): LowData => {
		const info = data.cells[serial] ?? { serial };
		return {
			...data,
			cells: {
				...data.cells,
				[serial]: { ...info, ...newInfo }
			}
		};
	};
}
