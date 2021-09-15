import { Readable, Writable, writable } from 'svelte/store';
import type { Cell, Repository } from '../database';
import type { CellState } from './state';

export type CellInfo = Cell;

export interface CellData {
	serial: string;
	info: CellInfo;
	state: CellState;
}

export class CellManager {
	private readonly _info: Writable<ReadonlyMap<string, CellInfo>>;
	private readonly _state: Writable<ReadonlyMap<string, CellState>>;

	constructor(private readonly repo: Repository) {
		this._info = writable(new Map());
		this._state = writable(new Map());
	}

	get info(): Readable<ReadonlyMap<string, CellInfo>> {
		return this._info;
	}

	get state(): Readable<ReadonlyMap<string, CellState>> {
		return this._state;
	}

	async loadInfo(): Promise<void> {
		// TODO load info
	}

	register(serial: string, info: CellInfo): void {
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
