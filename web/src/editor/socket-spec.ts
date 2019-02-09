export interface SocketSpec<T> {
    event: string;
    handler(arg: T): void;
}

interface Emitter {
    on(event: string, fn: Function): this;
}

export function on(socket: Emitter, spec: SocketSpec<unknown>) {
    socket.on(spec.event, spec.handler);
}
