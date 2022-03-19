import { asPower } from '../../../../lib/android/power';

export function parsePowerBody(body: unknown): boolean | undefined {
	if (typeof body === 'boolean' || typeof body === 'string') {
		return asPower(body);
	} else if (typeof body === 'object' && body !== null) {
		if (body instanceof URLSearchParams) {
			return asPower(body.get('on'));
		} else {
			const { on } = body as { on?: unknown };
			return asPower(on);
		}
	}
	return undefined;
}
