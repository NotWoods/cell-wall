import { blankState, CellState } from '@cell-wall/cell-state';
import type { FastifyInstance } from 'fastify';
import type { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { cellStateFor } from './lib/cells';
import { repo } from './lib/repository';
import type { WebSocketInfo } from './lib/repository/socket-store';

const CELL_SERIAL = /^\/cells\/(\w+)\/?$/;
const blankBuffer = new ArrayBuffer(0);

function handleCellConnection(ws: WebSocket, request: IncomingMessage) {
	const { pathname } = new URL(request.url!, `http://${request.headers.host}`);
	const [, serial] = pathname.match(CELL_SERIAL)!;

	repo.webSockets.add(serial, {});

	let lastState: CellState = blankState;
	const unsubscribe = cellStateFor(repo.cellState, serial).subscribe((state) => {
		if (!state) return;

		if (state.type === lastState.type) {
			const { payload = blankBuffer } = state;
			ws.send(payload);
		}

		ws.send(JSON.stringify(state));
		ws.send(blankBuffer);
		lastState = state;
	});

	ws.on('message', (data) => {
		const info = JSON.parse(data.toString()) as WebSocketInfo;
		repo.webSockets.add(serial, info);
	});

	ws.on('close', () => {
		unsubscribe();
		repo.webSockets.delete(serial);
	});
}

function handleRemoteConnection(ws: WebSocket) {
	const unsubscribe = repo.cellData.subscribe((data) => {
		const dataObject = JSON.stringify(Object.fromEntries(data));
		ws.send(dataObject);
	});

	ws.on('close', unsubscribe);
}

export async function websocketSubsystem(fastify: FastifyInstance): Promise<void> {
	const remoteServer = new WebSocketServer({ noServer: true });
	const cellServer = new WebSocketServer({ noServer: true });

	fastify.server.on('upgrade', (request, socket, head) => {
		const { pathname } = new URL(request.url!, `http://${request.headers.host}`);
		if (pathname === '/remote') {
			remoteServer.handleUpgrade(request, socket, head, (ws) => {
				remoteServer.emit('connection', ws, request);
			});
		} else if (CELL_SERIAL.test(pathname)) {
			cellServer.handleUpgrade(request, socket, head, (ws) => {
				cellServer.emit('connection', ws, request);
			});
		} else {
			socket.destroy();
		}
	});

	remoteServer.on('connection', handleRemoteConnection);
	cellServer.on('connection', handleCellConnection);
}
