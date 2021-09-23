import type { ParameterizedBody } from '@sveltejs/kit/types/app';
import type { Power } from '$lib/android/power';
import { asPower } from '$lib/android/power';
import { isRawBody } from '../state/_body';

export function parsePowerBody(body: ParameterizedBody): Power | undefined {
	if (typeof body === 'string') {
		const json: unknown = JSON.parse(body);
		if (typeof json === 'boolean' || typeof json === 'string') {
			return asPower(json);
		} else if (typeof json === 'object' && json !== null) {
			const { on } = json as { on?: unknown };
			return asPower(on);
		}
	} else if (!isRawBody(body)) {
		return asPower(body.get('on'));
	}
	return undefined;
}
