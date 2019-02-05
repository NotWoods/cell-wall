export interface SocketSpec {
    event: string;
    handler(...args: any[]): void;
}

interface Emitter {
    on(event: string, fn: Function): this;
}

export function on(socket: Emitter, spec: SocketSpec) {
    socket.on(spec.event, spec.handler);
}
