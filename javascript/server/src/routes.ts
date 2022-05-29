import type { FastifyInstance } from 'fastify';

export async function routesSubsystem(fastify: FastifyInstance): Promise<void> {
	await fastify
		.register(import('./routes/api/action/image'))
		.register(import('./routes/api/action/install'))
		.register(import('./routes/api/action/launch'))
		.register(import('./routes/api/action/refresh'))
		.register(import('./routes/api/action/text'))
		.register(import('./routes/api/device/info'))
		.register(import('./routes/api/device/power'))
		.register(import('./routes/api/device/preset'))
		.register(import('./routes/api/device/state-array'))
		.register(import('./routes/api/device/state'))
		.register(import('./routes/api/device/index'))
		.register(import('./routes/api/third_party/freebusy'))
		.register(import('./routes/api/third_party/index'))
		.register(import('./routes/api/cellwall-version'))
		.register(import('./routes/index'))
		.register(import('./routes/oauth2callback'));
}
