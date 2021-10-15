import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import type { CellInfo } from '../../../lib/cells';
import { repo } from '../../../lib/repository';

export default function (fastify: FastifyInstance): void {
	fastify.route<{
		Reply: Record<string, CellInfo>;
	}>({
		method: 'GET',
		url: '/api/device/',
		async handler(request, reply) {
			reply.send(Object.fromEntries(getState(repo.cellData)));
		}
	});
}
