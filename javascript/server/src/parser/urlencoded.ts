import type { FastifyInstance, FastifyRequest, RawRequestDefaultExpression } from 'fastify';

export type ReadonlyURLSearchParams = Omit<URLSearchParams, 'append' | 'delete' | 'set' | 'sort'>;

/**
 * Parse application/x-www-form-urlencoded bodies into URLSearchParams
 */
export function urlEncodedPlugin(fastify: FastifyInstance): void {
	fastify.addContentTypeParser(
		'application/x-www-form-urlencoded',
		async (_request: FastifyRequest, payload: RawRequestDefaultExpression) => {
			const chunks: string[] = [];
			for await (const chunk of payload) {
				chunks.push(chunk);
			}

			const body: ReadonlyURLSearchParams = new URLSearchParams(chunks.join(''));
			return body;
		}
	);
}
