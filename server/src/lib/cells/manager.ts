import { get, writable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import type { Cell, Database } from '../database';
import type { CellState } from './state';

export type CellInfo = Cell;

export class CellManager {
	private readonly _info = writable<ReadonlyMap<string, Cell>>(new Map());
	private readonly _state = writable<ReadonlyMap<string, CellState>>(new Map());

	get info(): Readable<ReadonlyMap<string, Cell>> {
		return this._info;
	}

	get state(): Readable<ReadonlyMap<string, CellState>> {
		return this._state;
	}

	async loadInfo(db: Database): Promise<void> {
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
	}

	async writeInfo(db: Database): Promise<void> {
		await db.insertCells(Array.from(get(this.info).values()));
	}

	register(serial: string, info: Cell): void {
		this._info.update((map) => new Map(map).set(serial, info));
	}

	setState(serial: string, state: CellState): void {
		this._state.update((map) => new Map(map).set(serial, state));
	}

	setStateMap(states: { [serial: string]: CellState } | Map<string, CellState>): void {
		const entries: Iterable<[string, CellState]> =
			typeof states.entries === 'function' ? states.entries() : Object.entries(states);

		this._state.update((map) => new Map([...map, ...entries]));
	}
}
