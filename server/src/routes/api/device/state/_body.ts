import type { RawBody } from '@sveltejs/kit';
import type { CellState } from '$lib/cells';
import { CellStateType } from '$lib/cells';
import { isObject } from '$lib/body';

export function isRawBody(maybeRaw: unknown): maybeRaw is RawBody {
	return maybeRaw === null || maybeRaw instanceof Uint8Array;
}

export function asObject(maybeObject: unknown): object | undefined {
	if (typeof maybeObject === 'object' && maybeObject !== null) {
		return maybeObject;
	} else {
		return undefined;
	}
}

export function asCellState(maybeState: unknown): CellState | undefined {
	if (isObject(maybeState)) {
		const state = maybeState as { type: string };
		if (state.type in CellStateType) {
			return state as CellState;
		}
	}
	return undefined;
}
