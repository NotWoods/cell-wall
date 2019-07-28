import { watch, readFile, writeFile, access, constants } from 'fs';
import { promisify } from 'util';
import { Socket } from 'socket.io';
import { ConfigState } from './state-types.js';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const accessAsync = promisify(access);
async function readJson(path: string | number | Buffer): Promise<unknown> {
    const json = await readFileAsync(path, { encoding: 'utf8' });
    return JSON.parse(json);
}

type Listener = (newState: ConfigState) => void;

/**
 * Observable configuration file.
 */
export function config(configPath: string, defaultConfigPath: string) {
    const listeners = new Set<Listener>();
    let state: ConfigState | undefined;

    function socketToListener(socket: Socket): Listener {
        const listener: Listener = newState => {
            socket.emit('new-config-state', newState);
        };
        socket.on('disconnect', () => listeners.delete(listener));
        return listener;
    }

    (async function() {
        const opts = { encoding: 'utf8' };

        const defaults = (await readJson(defaultConfigPath)) as ConfigState;

        try {
            await accessAsync(configPath, constants.F_OK);
        } catch (err) {
            await writeFileAsync(configPath, JSON.stringify(defaults), opts);
        }

        watch(configPath, opts, async (_eventType, filename) => {
            const data = (await readJson(filename)) as ConfigState;
            const newState = Object.assign({}, defaults, data);

            listeners.forEach(listener => listener(newState));
        });
    })();

    return {
        getState: () => state,
        subscribe(listener: Listener | Socket) {
            if (typeof listener !== 'function') {
                listener = socketToListener(listener);
            }

            listeners.add(listener);
            if (state) listener(state);
        },
    };
}
