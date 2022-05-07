import type { CellState } from '@cell-wall/shared';
import { setTimeout } from 'timers/promises';
import type { CellStateStore } from '../cells';

const DELAY_MS = /^(\d+)(?:ms)?$/;
const DELAY_SECONDS = /^(\d+)s?$/;

/**
 * Parse a string representing a delay into a number of milliseconds.
 * @param delay A string representing a delay.
 * Can be in format `<number>ms` or `<number>s`.
 * A plain number also works.
 * @returns The delay in milliseconds, or undefined if the string is empty.
 * @throws If the string does not follow the correct format.
 */
export function asDelay(delay: string | undefined): number | undefined {
	delay = delay?.trim();
	if (!delay) return undefined;

	let delayMs: number | undefined;
	const matchMs = DELAY_MS.exec(delay);
	if (matchMs) {
		delayMs = Number(matchMs[1]);
	} else {
		const matchSeconds = DELAY_SECONDS.exec(delay);
		if (matchSeconds) {
			delayMs = Number(matchSeconds[1]) * 1000;
		}
	}

	if (typeof delayMs === 'number' && !Number.isNaN(delayMs)) {
		return delayMs;
	} else {
		throw new TypeError(`Invalid delay: ${delay}`);
	}
}

export async function setStatesWithDelay(
	store: CellStateStore,
	states: readonly CellState[],
	deviceIds: readonly string[],
	delay: number
) {
	if (delay > 0) {
		for (const [i, state] of states.entries()) {
			// Wrap around if needed
			const deviceId = deviceIds[i % deviceIds.length];
			store.setState(deviceId, state);
			await setTimeout(delay);
		}
	} else {
		// Fast batch path if no delay is set
		const stateMap = new Map<string, CellState>();
		for (const [i, state] of states.entries()) {
			// Wrap around if needed
			const deviceId = deviceIds[i % deviceIds.length];
			stateMap.set(deviceId, state);
		}
		store.setStates(stateMap);
	}
}
