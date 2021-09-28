// @ts-nocheck
import polka from 'polka';
import { path, host, port } from '../../.svelte-kit/node/env.js';
import { assetsMiddleware, kitMiddleware, prerenderedMiddleware } from '../../build/middlewares.js';
import { broadcastStoreState, upgradeToWebsocket } from './socket';

/** @type {import('$lib/repository').Repository} */
const repo = /** @type {any} */ (globalThis)._repo;
const { wss } = broadcastStoreState(repo.cellData, { noServer: true });

const server = polka().use(assetsMiddleware, kitMiddleware, prerenderedMiddleware);

const listenOpts = { path, host, port };

server.listen(listenOpts, () => {
	console.log(`Listening on ${path ? path : host + ':' + port}`);
});

server.server?.on(
	'upgrade',
	upgradeToWebsocket(() => wss)
);

export { server };
