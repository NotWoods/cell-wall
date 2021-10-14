import Fastify from 'fastify';
import { clientSubsystem } from './client';
import { routesSubsystem } from './routes';
import { websocketSubsystem } from './websocket';

const fastify = Fastify({
	logger: true
});

fastify
	.register(routesSubsystem)
	.register(clientSubsystem)
	.register(websocketSubsystem)
	.listen(3000)
	.then((address) => console.log(`Listening on ${address}`))
	.catch((err) => {
		console.error('error starting server', err);
		process.exit(1);
	});
