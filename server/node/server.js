import polka from 'polka';
import { assetsMiddleware, kitMiddleware, prerenderedMiddleware } from '../build/middlewares.js';
import { broadcastStoreState, upgradeToWebsocket } from './socket.js';

/** @type {import('$lib/repository').Repository} */
const repo = /** @type {any} */ (globalThis)._repo;
const { wss } = broadcastStoreState(repo.cellData, { noServer: true });

const server = polka().use(assetsMiddleware, kitMiddleware, prerenderedMiddleware);

const path = process.env['SOCKET_PATH'] || false;
const host = process.env['HOST'] || '0.0.0.0';
const port = process.env['PORT'] || (!path && 3000);

const listenOpts = { path, host, port };

server.listen(listenOpts, () => {
	console.log(`Listening on ${path ? path : host + ':' + port}`);
});

server.server?.on(
	'upgrade',
	upgradeToWebsocket(() => wss)
);

export { server };
