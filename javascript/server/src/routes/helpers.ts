import { DeviceMap, setPower } from '@cell-wall/android-bridge';
import { CellStateType } from '@cell-wall/cells';
import { filterMap } from '@cell-wall/iterators';
import { FastifyInstance } from 'fastify';

export interface SerialParams {
  serial?: string;
}

export type RestBehaviour = 'blank' | 'off' | 'ignore';

export interface RestQuery {
  rest?: RestBehaviour;
}

export function filterDevices(
  app: FastifyInstance,
  serial: string | undefined,
): DeviceMap {
  if (serial) {
    const device = app.deviceManager.devices.get(serial);
    if (device) {
      return new Map().set(serial, device);
    } else {
      throw app.httpErrors.notFound(`Could not find device ${serial}`);
    }
  } else {
    return app.deviceManager.devices;
  }
}

export async function updateRest(
  app: FastifyInstance,
  serials: Set<string>,
  rest: RestBehaviour = 'ignore',
) {
  switch (rest) {
    case 'blank':
      app.cells.setStateAll(serials, { type: CellStateType.BLANK });
      break;
    case 'off':
      await setPower(
        filterMap(app.deviceManager.devices, (_, serial) =>
          serials.has(serial),
        ),
        false,
      );
      break;
    case 'ignore':
      break;
  }
}
