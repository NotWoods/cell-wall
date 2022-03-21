import type { FastifyInstance } from 'fastify';
import { get } from 'svelte/store';
import { repo } from '../../../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Reply: { google_authorize_url?: string | undefined };
	}>({
		method: 'GET',
		url: '/api/third_party/',
		async handler(request, reply) {
			const googleClient = await repo.thirdParty.google;

			reply.send({ google_authorize_url: get(googleClient.authorizeUrl) });
		}
	});
}
