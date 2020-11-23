import { CellInfo, CellManager } from '@cell-wall/cells';
import { filterMap, transformMap } from '@cell-wall/iterators';
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

    let cells: Pick<CellManager, 'entries'> = this.cells;
    if (serial) {
      const filtered = filterMap(cells, (cell) => cell.serial === serial);
      if (filtered.size === 0) {
        return reply.notFound(`Could not find cell ${serial}`);
      }
      cells = filtered;
    }

    const entries = transformMap(cells, (cell) => cell.info);
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
