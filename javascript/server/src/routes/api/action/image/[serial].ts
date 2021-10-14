import type { FastifyInstance } from 'fastify';
import { repo } from '../../../../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Params: { serial: string };
	}>({
		method: 'GET',
		url: '/api/action/image/:serial',
		async handler(request, reply) {
			const { serial } = request.params;

			const cached = repo.images.get(serial);
			if (!cached) {
				reply.status(404);
				return;
			}

			const mime = cached.getMIME();
			const buffer = await cached.getBufferAsync(mime);
			reply.status(200).header('content-type', mime).send(buffer);
		}
	});
}
