import Fastify from 'fastify';
import middie from 'middie';
import { routesSubsystem } from './routes';
import { websocketSubsystem } from './websocket';

export async function createServer() {
	const fastify = Fastify({
		logger: {
			prettyPrint: {
				translateTime: 'yyyy-mm-dd HH:MM:ss.l',
				levelFirst: true,
				ignore: 'pid,hostname,reqId,responseTime,req,res',
				messageFormat: '{msg} [id={reqId} {req.method} {req.url}]'
			}
		},
		trustProxy: true
	});

	await fastify.register(middie);
	await fastify.register(routesSubsystem).register(websocketSubsystem);

	return fastify;
}
