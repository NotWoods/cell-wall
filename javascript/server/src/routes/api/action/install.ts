import type { FastifyInstance } from 'fastify';
import { repo } from '../../../lib/repository';
import type { ReadonlyURLSearchParams } from '../../../parser/urlencoded';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Body: ReadonlyURLSearchParams;
	}>({
		method: 'POST',
		url: '/api/action/install',
		schema: {
			response: {
				200: {
					type: 'object',
					additionalProperties: {
						type: 'object',
						properties: {
							wasUninstalled: { type: 'boolean' },
							appState: { type: 'string' }
						}
					}
				}
			}
		},
		async handler(request, reply) {
			const results = await repo.installApk(request.body.get('tag') ?? undefined);
			reply.send(Object.fromEntries(results));
		}
	});
}
