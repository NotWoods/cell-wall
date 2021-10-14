import type { FastifyInstance } from 'fastify';

export async function routesSubsystem(fastify: FastifyInstance): Promise<void> {
	await fastify
		.register(import('./routes/api/action/image/[serial]'))
		.register(import('./routes/api/action/image/index'))
		.register(import('./routes/api/action/install'))
		.register(import('./routes/api/action/refresh'))
		.register(import('./routes/api/device/power/[serial]'))
		.register(import('./routes/api/device/power/index'))
		.register(import('./routes/api/device/state/[serial]'))
		.register(import('./routes/api/device/state/index'))
		.register(import('./routes/api/device/state/preset'))
		.register(import('./routes/api/device/[serial]'))
		.register(import('./routes/api/device/index'))
		.register(import('./routes/api/third_party/freebusy'))
		.register(import('./routes/api/cellwall-version'))
		.register(import('./routes/oauth2callback'));
}
