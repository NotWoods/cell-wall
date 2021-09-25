import type { ParameterizedBody } from '@sveltejs/kit/types/app';

interface BodyTypeRaw {
	type: 'raw';
	body: Uint8Array;
}

interface BodyTypeNull {
	type: 'null';
	body: null;
}

interface BodyTypeString {
	type: 'text';
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

export type BodyType =
	| BodyTypeRaw
	| BodyTypeNull
	| BodyTypeString
	| BodyTypeFormData
	| BodyTypeJson;

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
				return { type: 'text', body };
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
			if (body === null) {
				return { type: 'null', body };
			} else if (body instanceof Uint8Array) {
				return { type: 'raw', body };
			} else {
				throw new Error(`Content-Type ${type} does not match ${typeof body} body`);
			}
	}
}

export function isObject(maybe: unknown): maybe is object {
	return typeof maybe === 'object' && maybe !== null;
}

export function bodyAsJson(input: PartialInput): unknown | undefined {
	const body = bodyType(input);
	switch (body.type) {
		case 'json':
			return body.body;
		case 'text':
			return JSON.parse(body.body);
		case 'form':
			return Object.fromEntries(body.body.entries());
		default:
			return undefined;
	}
}
