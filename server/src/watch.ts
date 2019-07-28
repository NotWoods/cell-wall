import { watch, readFile } from 'fs';

interface State {
    defaultUrl: string;
    devices: {
        [udid: string]: {
            url?: string;
        };
    };
}

/**
 * Observable configuration file.
 */
export function config(configPath: string) {
    const listeners: Array<(newState: State) => void> = [];
    let state: State | undefined;

    watch(configPath, { encoding: 'utf8' }, (_eventType, filename) => {
        readFile(filename, { encoding: 'utf8' }, (_err, data) => {
            const newState = JSON.parse(data) as State;
            listeners.forEach(listener => listener(newState));
        });
    });

    return {
        getState: () => state,
        subscribe(listener: (newState: State) => void) {
            listeners.push(listener);
            if (state) listener(state);
        },
    };
}
