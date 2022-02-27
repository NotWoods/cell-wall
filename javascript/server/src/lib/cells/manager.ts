import type { CellInfo } from '@cell-wall/cell-state';
import type { Readable, Subscriber, Unsubscriber } from 'svelte/store';
import { get, writable } from 'svelte/store';
import type { Database } from '../repository/database';

export class CellManager implements Readable<ReadonlyMap<string, CellInfo>> {
	private readonly _info = writable<ReadonlyMap<string, CellInfo>>(new Map());

	get info(): Readable<ReadonlyMap<string, CellInfo>> {
		return this._info;
	}

	subscribe(
		run: Subscriber<ReadonlyMap<string, CellInfo>>,
		invalidate?: (value?: ReadonlyMap<string, CellInfo>) => void
	): Unsubscriber {
		return this._info.subscribe(run, invalidate);
	}

	async loadInfo(db: Database): Promise<CellManager> {
		try {
			const cells = await db.getCells();
			this._info.update((map) => {
				const newMap = new Map(map);
				for (const cell of cells) {
					newMap.set(cell.serial, cell);
				}
				return newMap;
			});
		} catch (err) {
			console.error('Could not load CellManager data', err);
			// do nothing, just use blank data
		}
		return this;
	}

	async writeInfo(db: Database): Promise<void> {
		await db.insertCells(Array.from(get(this._info).values()));
	}

	register(serial: string, info: CellInfo): void {
		this._info.update((map) => new Map(map).set(serial, info));
	}

	registerServer(serial: string, server: string): void {
		this._info.update((map) => {
			const info = map.get(serial);
			if (info) {
				return new Map(map).set(serial, { ...info, server });
			} else {
				return map;
			}
		});
	}
}
