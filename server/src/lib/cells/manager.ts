import { Readable, writable } from 'svelte/store';
import type { Cell, CellDao } from '../database';
import type { CellState } from './state';

export type CellInfo = Cell;

export class CellManager {
	private readonly _info = writable<ReadonlyMap<string, Cell>>(new Map());
	private readonly _state = writable<ReadonlyMap<string, CellState>>(new Map());

	constructor(private readonly cellDao: CellDao) {}

	get info(): Readable<ReadonlyMap<string, Cell>> {
		return this._info;
	}

	get state(): Readable<ReadonlyMap<string, CellState>> {
		return this._state;
	}

	async loadInfo(): Promise<void> {
		// TODO load info
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
