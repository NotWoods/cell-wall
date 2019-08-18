import { watchJson, readJson, writeJson, ensureFile } from '../fs';
import { Socket } from 'socket.io';
import { ConfigState } from './state-types.js';

export type Listener = (newState: ConfigState) => void;

export type LiveConfig = ReturnType<typeof liveConfig>;

/**
 * Observable configuration file.
 *
 * This is the core of the system. Other components will observe the live config
 * for changes and update based on what has changed.
 *
 * @param configPath Path where the config file will be stored.
 * If no file is present, one will be created.
 * @param defaultConfigPath Path to the default configuration.
 * This file must exist.
 */
export function liveConfig(configPath: string, defaultConfigPath: string) {
    const listeners = new Set<Listener>();
    let state: ConfigState | undefined;
    let defaults: ConfigState | undefined;

    // Convert sockets to listener functions
    function socketToListener(socket: Socket): Listener {
        const listener: Listener = newState =>
            socket.emit('new-config-state', newState);
        socket.on('disconnect', () => listeners.delete(listener));
        return listener;
    }

    function onNewState(statePartial: ConfigState) {
        const newState = Object.assign({}, defaults, statePartial);
        listeners.forEach(listener => listener(newState));
    }

    const stateReady = (async function() {
        defaults = (await readJson(defaultConfigPath)) as ConfigState;

        // Create the file if it does not exist
        await ensureFile(configPath, () => JSON.stringify(defaults));

        state = (await readJson(configPath)) as ConfigState;
        onNewState(state);

        watchJson(configPath, data => onNewState(data as ConfigState));
    })();

    return {
        getStateSync: () => state,
        async getState() {
            await stateReady;
            return state!;
        },
        async setState(state: ConfigState) {
            const newState = Object.assign({}, defaults, state);
            await writeJson(configPath, newState);
        },
        subscribe(listener: Listener | Socket) {
            if (typeof listener !== 'function') {
                listener = socketToListener(listener);
            }

            listeners.add(listener);
            if (state) listener(state);
        },
    };
}
