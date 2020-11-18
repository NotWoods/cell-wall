import { CellInfo } from '@cell-wall/cells';
import { SerialParams } from '../helpers';
import { MultiRouteOptions, RouteOptions } from '../register';

const cellInfoSchema = {
  type: 'object',
  properties: {
    deviceName: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    server: { type: 'string' },
  },
};

export const getCells: MultiRouteOptions<{
  Params: SerialParams;
  Reply: Record<string, CellInfo>;
}> = {
  method: 'GET',
  url: ['/v3/device', '/v3/device/:serial'],
  schema: {
    response: {
      200: {
        type: 'object',
        additionalProperties: cellInfoSchema,
      },
    },
  },
  async handler(request, reply) {
    const { serial } = request.params;

    let cells = Array.from(this.cells.values());
    if (serial) {
      cells = cells.filter((cell) => cell.serial === serial);
      if (cells.length === 0) {
        return reply.notFound(`Could not find cell ${serial}`);
      }
    }

    const entries = cells.map((cell) => [cell.serial, cell.info] as const);
    reply.status(200).send(Object.fromEntries(entries));
  },
};

export const registerCell: RouteOptions<{
  Params: Required<SerialParams>;
  Body: CellInfo;
  Reply: { socket: string };
}> = {
  method: 'PUT',
  url: '/v3/device/:serial',
  schema: {
    body: cellInfoSchema,
    response: {
      200: {
        type: 'object',
        properties: {
          socket: { type: 'string' },
        },
      },
    },
  },
  async handler(request, reply) {
    const { serial } = request.params;
    const info = request.body;
    const devices = this.deviceManager.devices;

    if (devices.has(serial)) {
      this.cells.register(serial, info);
      reply.status(200).send({
        socket: `/v3/cell?serial=${serial}`,
      });
    } else {
      reply.notFound(`Could not find matching serial`);
    }
  },
};
