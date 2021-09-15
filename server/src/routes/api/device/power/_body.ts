import { asPower, Power } from '$lib/android/power';

export function parsePowerBody(body: unknown): Power | undefined {
	if (body instanceof FormData) {
		return asPower(body.get('on'));
	} else if (typeof body === 'string') {
		const json: unknown = JSON.parse(body);
		if (typeof json === 'boolean' || typeof json === 'string') {
			return asPower(json);
		} else if (typeof json === 'object' && json !== null) {
			const { on } = json as { on?: unknown };
			return asPower(on);
		}
	}
	return undefined;
}
