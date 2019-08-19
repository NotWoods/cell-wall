import { Readable } from 'stream';
import { configRequestListener } from '../../../server/config/request-listener';
import { ConfigState } from '../../../server/config/state-types';

describe('configRequestListener', () => {
    let state: ConfigState = {
        defaultUrl: 'https://tigeroakes.com',
        width: 10,
        height: 10,
        devices: {},
    };
    const store = {
        getStateSync: jest.fn().mockReturnValue(state),
        getState: jest.fn().mockResolvedValue(state),
        setState: jest.fn(),
        subscribe: jest.fn(),
    };
    const response = {
        writeHead: jest.fn(),
        end: jest.fn(),
    };
    response.writeHead.mockReturnValue(response);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('returns 404 for unknown URL', async () => {
        const listener = configRequestListener(store);
        const mockRequest = {
            url: '/some-path',
            method: 'GET',
        };

        await listener(mockRequest as any, response as any);

        expect(response.writeHead).toBeCalledWith(404);
        expect(response.end).toBeCalledWith('Not Found');
    });

    test('returns state for GET request', async () => {
        const listener = configRequestListener(store);
        const mockRequest = {
            url: '/config',
            method: 'GET',
        };

        await listener(mockRequest as any, response as any);

        expect(response.writeHead).toBeCalledWith(200, {
            'Content-Type': 'application/json',
        });
        expect(response.end).toBeCalledWith(JSON.stringify(state));
        expect(store.getState).toBeCalled();
    });

    test('sets state for POST request', async () => {
        const listener = configRequestListener(store);
        const mockRequest = Readable.from([JSON.stringify(state)]);
        Object.assign(mockRequest, {
            url: '/config',
            method: 'POST',
        });

        await listener(mockRequest as any, response as any);

        expect(response.writeHead).toBeCalledWith(201);
        expect(response.end).toBeCalledWith('Created');
        expect(store.setState).toBeCalledWith(state);
    });
});
