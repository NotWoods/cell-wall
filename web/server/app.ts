import { createServer } from 'http';
import SocketIO from 'socket.io';
import { ACTION_VIEW_CELLWALL, getClients, intent } from './adb.js';
import { liveConfig } from './config/live-config.js';
import { configRequestListener } from './config/request-listener.js';

// Load configuration store
const store = liveConfig('config.json', 'config.default.json');

const server = createServer(configRequestListener(store));
const io = SocketIO(server);
io.on('connection', store.subscribe);

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

export default server;
