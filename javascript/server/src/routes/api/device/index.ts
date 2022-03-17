import type { CellInfo } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { repo } from '../../../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
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
