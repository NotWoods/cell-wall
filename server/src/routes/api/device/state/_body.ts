import { CellState, CellStateType } from '$lib/cells';
import type { RawBody } from '@sveltejs/kit';

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

export function asCellState(maybeState: { type?: unknown }): CellState | undefined {
	if (!asObject(maybeState)) return undefined;
	if ((maybeState.type as string) in CellStateType) {
		return maybeState as CellState;
	} else {
		return undefined;
	}
}
