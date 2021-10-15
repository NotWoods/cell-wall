import Fastify from 'fastify';
import middie from 'middie';
import mimimist from 'minimist';
import { assetsMiddleware, kitMiddleware, prerenderedMiddleware } from '@cell-wall/client';
import { routesSubsystem } from './routes';
import { websocketSubsystem } from './websocket';
import { urlEncodedPlugin } from './parser/urlencoded';

interface Options {
	address?: string;
	port?: number;
}

async function main(options: Options) {
	const fastify = Fastify({
		logger: true,
		trustProxy: true
	});

	await fastify.register(urlEncodedPlugin).register(middie);
	fastify.use(assetsMiddleware);
	await fastify.register(routesSubsystem).register(websocketSubsystem);
	fastify.use(kitMiddleware).use(prerenderedMiddleware);

	const address = await fastify.listen(options.port ?? 3000, options.address ?? '0.0.0.0');
	console.log(`Listening on ${address}`);
}

const argv = mimimist(process.argv.slice(2), {
	alias: {
		a: 'address',
		p: 'port'
	}
});
main(argv as Options).catch((err: unknown) => {
	console.error('error starting server', err);
	process.exit(1);
});
