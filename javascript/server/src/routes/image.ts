import {
  cellCoordsValid,
  CellData,
  CellStateType,
  DiffSet,
} from '@cell-wall/cells';
import { filterMap, transformMap } from '@cell-wall/iterators';
import { RESIZE, ResizeOptions, splitImage } from '@cell-wall/split-image';
import Jimp from 'jimp';
import { RestQuery, SerialParams, updateRest } from './helpers.js';
import { RouteOptions } from './register.js';

interface ImageQuerystring extends ResizeOptions, RestQuery {
  device?: string[] | string;
}

function parseDeviceQuery({ device: devices }: ImageQuerystring = {}): (
  cell: CellData,
) => boolean {
  let included: (serial: string) => boolean;
  if (Array.isArray(devices)) {
    if (devices.length > 0) {
      const set = new Set(devices);
      included = (serial) => set.has(serial);
    } else {
      included = () => true;
    }
  } else if (typeof devices === 'string') {
    included = (serial) => serial === devices;
  } else {
    included = () => true;
  }

  return (cell) => included(cell.serial) && cellCoordsValid(cell.info);
}

const imageCache = new Map<string, Jimp>();

export const actionGetLoadedImage: RouteOptions<{
  Params: Required<SerialParams>;
}> = {
  method: 'GET',
  url: '/v3/action/image/:serial',
  async handler(request, reply) {
    const { serial } = request.params;

    const cached = imageCache.get(serial);
    if (!cached) {
      reply.status(404).sendFile('assets/logo.png');
      return;
    }

    const mime = cached.getMIME();
    const buffer = await cached.getBufferAsync(mime);
    reply.status(200).header('content-type', mime).send(buffer);
  },
};

export const actionImage: RouteOptions<{
  Body: Jimp;
  Querystring: ImageQuerystring;
}> = {
  method: 'POST',
  url: '/v3/action/image',
  schema: {
    querystring: {
      type: 'object',
      properties: {
        horizontalAlign: {
          type: 'string',
          enum: ['left', 'center', 'right'],
        },
        verticalAlign: {
          type: 'string',
          enum: ['top', 'middle', 'bottom'],
        },
        resize: {
          type: 'string',
          enum: Array.from(RESIZE),
        },
        rest: {
          type: 'string',
          enum: ['ignore', 'blank', 'off'],
        },
      },
    },
  },
  async handler(request, reply) {
    const image = request.body;
    const included = parseDeviceQuery(request.query);
    const { rest } = request.query;

    const cells = transformMap(
      filterMap(this.cells, included),
      (cell) => cell.info,
    );

    const cropped = await splitImage(image, cells, request.query);

    imageCache.clear();
    const urls = transformMap(cropped, ({ info, img }, serial) => {
      imageCache.set(serial, img);
      return {
        src: `/v3/action/image/${serial}`,
        x: info.x,
        y: info.y,
        width: info.width,
        height: info.height,
      };
    });

    this.cells.setStateMap(
      transformMap(urls, ({ src }) => ({
        type: CellStateType.IMAGE,
        src,
      })),
    );

    if (rest) {
      const modified = new DiffSet(this.cells.keys(), urls.keys()).toResult();
      await updateRest(this, modified.rest, rest);
    }

    reply.status(200).send(Object.fromEntries(urls));
  },
};

export const deleteImage: RouteOptions = {
  method: 'DELETE',
  url: '/v3/action/image',
  async handler(_request, reply) {
    imageCache.clear();
    reply.status(201).send();
  },
};
