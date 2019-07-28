import { config } from './watch.js';
import { getClients, intent, ACTION_VIEW_CELLWALL } from './adb.js';

async function main() {
    // Load configuration store
    config('config.json').subscribe(async state => {
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
}

main();
