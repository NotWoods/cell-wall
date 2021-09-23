import type { RawBody } from '@sveltejs/kit';
import type { ParameterizedBody } from '@sveltejs/kit/types/app';

interface BodyTypeRaw {
	type: 'raw';
	body: RawBody;
}

interface BodyTypeString {
	type: 'string';
	body: string;
}

interface BodyTypeFormData {
	type: 'form';
	body: ParameterizedBody<FormData>;
}

interface BodyTypeJson {
	type: 'json';
	body: unknown;
}

export type BodyType = BodyTypeRaw | BodyTypeString | BodyTypeFormData | BodyTypeJson;

interface PartialInput {
	headers: { 'content-type'?: string };
	body: ParameterizedBody;
}

/**
 * Identify the type of the body provided from Svelte Kit.
 */
export function bodyType({ headers, body }: PartialInput): BodyType {
	// Taken from Svelte Kit
	const [type] = (headers['content-type'] || '').split(/;\s*/);

	switch (type) {
		case 'text/plain':
			if (typeof body === 'string') {
				return { type: 'string', body };
			} else {
				throw new Error(`Content-Type ${type} does not match ${typeof body} body`);
			}
		case 'application/json':
			return { type: 'json', body };
		case 'application/x-www-form-urlencoded':
		case 'multipart/form-data':
			if (typeof body === 'string' || body === null || body instanceof Uint8Array) {
				throw new Error(`Content-Type ${type} does not match ${typeof body} body`);
			} else {
				return { type: 'form', body };
			}
		default:
			if (body === null || body instanceof Uint8Array) {
				return { type: 'raw', body };
			} else {
				throw new Error(`Content-Type ${type} does not match ${typeof body} body`);
			}
	}
}

export function isObject(maybe: object): maybe is object {
	return typeof maybe === 'object' && maybe !== null;
}
