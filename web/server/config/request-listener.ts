import getStream from 'get-stream';
import { RequestListener, STATUS_CODES } from 'http';
import { LiveConfig } from './live-config';

const CONFIG_PATH = '/config';

/**
 * Request listener that works with a live config.
 *
 * Offers GET and POST methods to work with the config.
 *
 * - GET /config:
 *   - Returns the current config state as JSON.
 * - POST /config:
 *   - Saves the JSON body as the new config state.
 */
export function configRequestListener(config: LiveConfig): RequestListener {
    return async (request, response) => {
        try {
            if (request.url === CONFIG_PATH && request.method === 'GET') {
                const body = JSON.stringify(await config.getState());
                response
                    .writeHead(200, { 'Content-Type': 'application/json' })
                    .end(body);
            } else if (
                request.url === CONFIG_PATH &&
                request.method === 'POST'
            ) {
                const body = await getStream(request);
                await config.setState(JSON.parse(body));
                response.writeHead(201).end(STATUS_CODES[201]);
            } else {
                response.writeHead(404).end(STATUS_CODES[404]);
            }
        } catch (err) {
            response.writeHead(500).end(String(err));
            throw err;
        }
    };
}
