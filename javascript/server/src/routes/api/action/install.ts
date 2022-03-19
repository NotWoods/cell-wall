import type { FastifyInstance } from 'fastify';
import { repo } from '../../../lib/repository';
import type { ReadonlyURLSearchParams } from '../../../parser/urlencoded';

/**
 * Installs the latest CellWall Client APK to all devices
 * @deprecated Moving away from Android client
 */
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
