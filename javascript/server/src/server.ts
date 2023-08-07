import Fastify from 'fastify';
import middie from '@fastify/middie';
import { urlEncodedPlugin } from './parser/urlencoded';
import { routesSubsystem } from './routes';
import { websocketSubsystem } from './websocket';

export async function createServer() {
	const fastify = Fastify({
		logger: {
			transport: {
				target: 'pino-pretty',
				options: {
					translateTime: 'yyyy-mm-dd HH:MM:ss.l',
					levelFirst: true,
					ignore: 'pid,hostname,reqId,responseTime,req,res',
					messageFormat: '{msg} [id={reqId} {req.method} {req.url}]'
				}
			}
		},
		trustProxy: true
	});

	await urlEncodedPlugin(fastify);
	await fastify.register(middie);
	await fastify.register(routesSubsystem).register(websocketSubsystem);

	return fastify;
}
