import { SchemaLike } from 'joi';
import { Socket } from 'socket.io';
import { Joi } from 'koa-joi-router';

interface SocketBaseSpec<T> {
    event: string;
    validate?: {
        params?: SchemaLike;
    };
    handler(socket: Socket, data: T): void | PromiseLike<void>;
}

interface ConnectSpec extends SocketBaseSpec<null> {
    event: 'connect';
    validate?: {
        params?: null;
        headers?: SchemaLike;
        query?: SchemaLike;
    };
    handler(socket: Socket): void | PromiseLike<void>;
}

const handshakeKeys: ('headers' | 'query')[] = ['headers', 'query'];

export type SocketSpec<T> = T extends null
    ? ConnectSpec | SocketBaseSpec<T>
    : SocketBaseSpec<T>;

/**
 * Router that takes SocketSpec routes and provides them to a
 * socket or namespace as a callback for connect events (`onConnect()`).
 * @example
 * const router = new SocketRouter();
 * router.route({
 *   event: 'connect',
 *   handler(socket) {
 *     console.log('Hello World');
 *   }
 * });
 * io.on('connection', router.onConnect());
 */
export class SocketRouter {
    private connectRoute?: ConnectSpec;
    private connectValidator?: ReturnType<
        SocketRouter['makeHandshakeValidator']
    >;
    private routes: SocketSpec<any>[] = [];
    private validators = new WeakMap<
        SocketSpec<any>,
        ReturnType<SocketRouter['makeValidator']>
    >();

    route(route: SocketSpec<any>) {
        if (route.event === 'connect') {
            this.connectRoute = route as ConnectSpec;
            this.connectValidator = this.makeHandshakeValidator(
                this.connectRoute,
            );
        } else {
            this.routes.push(route);
            this.validators.set(route, this.makeValidator(route));
        }
    }

    private makeValidator<T>(route: SocketSpec<T>): (data: T) => Promise<void> {
        const { validate } = route;
        if (validate && validate.params) {
            return async data => {
                await Joi.validate(data, validate.params!);
            };
        }
        return () => Promise.resolve();
    }

    private makeHandshakeValidator(
        route: ConnectSpec,
    ): (socket: Socket) => Promise<void> {
        const { validate } = route;
        if (!validate) return () => Promise.resolve();

        const schemas = new Map(
            handshakeKeys
                .filter(key => validate[key])
                .map(key => [key, validate[key]] as [typeof key, SchemaLike]),
        );
        return async socket => {
            await Promise.all(
                Array.from(schemas, ([key, schema]) =>
                    Joi.validate(socket.handshake[key], schema),
                ),
            );
        };
    }

    onConnect() {
        return async (socket: Socket) => {
            if (this.connectValidator) {
                await this.connectValidator(socket);
            }
            if (this.connectRoute) {
                await this.connectRoute.handler(socket);
            }

            for (const route of this.routes) {
                const validator = this.validators.get(route)!;
                socket.on(route.event, async data => {
                    await validator(data);
                    await route.handler(socket, data);
                });
            }
        };
    }
}
