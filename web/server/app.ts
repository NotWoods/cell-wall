import { createServer } from 'http';
import SocketIO from 'socket.io';
import { ACTION_VIEW_CELLWALL, getClients, intent } from './adb.js';
import { config } from './live-config.js';

// Load configuration store
const store = config('config.json', 'config.default.json');

const server = createServer((request, response) => {
    console.log(request.url);
    response.end('Hello Node.js server!');
});
const io = SocketIO(server);

store.subscribe(async state => {
    // Refresh clients on every state change
    // (since we can't watch for changes from adb)
    const clients = await getClients();

    await Promise.all(
        clients.map(async ({ adb, device }) => {
            // State that corresponds to a single device
            const deviceState = state.devices[device.udid];
            await intent(adb, {
                action: ACTION_VIEW_CELLWALL,
                data: deviceState.url || state.defaultUrl,
            });
        }),
    );
});
io.on('connection', store.subscribe);

export default server;
