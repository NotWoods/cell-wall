export function asPower(primitive: unknown): boolean | undefined {
	switch (primitive) {
		case true:
		case false:
			return primitive;
		case 'false':
			return false;
		case 0:
		case 1:
		case 'true':
			return Boolean(primitive);
		default:
			return undefined;
	}
}

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
