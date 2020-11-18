import {
  cellCanvas,
  shiftCell,
  CellCanvas,
  CellInfo,
  CellStateType,
  CellData,
} from '@cell-wall/cells';
import { transformMapAsync } from '@cell-wall/iterators';
import Jimp from 'jimp';
import { SerialParams } from './helpers';
import { RouteOptions } from './register';

interface ImageQuerystring {
  horizontalAlign?: string;
  verticalAlign?: string;
  resize?: string;
  device?: string[] | string;
}

const ALIGN_QUERY: Record<string, number> = {
  left: Jimp.HORIZONTAL_ALIGN_LEFT,
  right: Jimp.HORIZONTAL_ALIGN_RIGHT,
  center: Jimp.HORIZONTAL_ALIGN_CENTER,
  top: Jimp.VERTICAL_ALIGN_TOP,
  bottom: Jimp.VERTICAL_ALIGN_BOTTOM,
  middle: Jimp.VERTICAL_ALIGN_MIDDLE,
};

const RESIZE = new Set([
  Jimp.RESIZE_NEAREST_NEIGHBOR,
  Jimp.RESIZE_BILINEAR,
  Jimp.RESIZE_BICUBIC,
  Jimp.RESIZE_HERMITE,
  Jimp.RESIZE_BEZIER,
]);

function parseImageQuery(query: ImageQuerystring = {}) {
  const horizontalFlag = ALIGN_QUERY[query.horizontalAlign!] || 0;
  const verticalFlag = ALIGN_QUERY[query.verticalAlign!] || 0;
  const resize = RESIZE.has(query.resize as any) ? query.resize : undefined;

  return {
    alignBits: horizontalFlag | verticalFlag,
    resizeMode: resize,
  };
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

  return (cell) =>
    included(cell.serial) &&
    !isNaN(cell.info.x) &&
    !isNaN(cell.info.y) &&
    !isNaN(cell.info.width) &&
    !isNaN(cell.info.height);
}

function resize(
  image: Jimp,
  { width, height }: Pick<CellCanvas, 'width' | 'height'>,
  query: ImageQuerystring = {},
) {
  const { alignBits, resizeMode } = parseImageQuery(query);
  return new Promise<Jimp>((resolve, reject) =>
    image.cover(width, height, alignBits, resizeMode, (err, value) => {
      if (err) reject(err);
      else resolve(value);
    }),
  );
}

function crop(image: Jimp, cell: CellInfo) {
  return new Promise<Jimp>((resolve, reject) =>
    image.crop(cell.x, cell.y, cell.width, cell.height, (err, value) => {
      if (err) reject(err);
      else resolve(value);
    }),
  );
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
      },
    },
  },
  async handler(request, reply) {
    const image = request.body;
    const included = parseDeviceQuery(request.query);

    const cells = Array.from(this.cells.values()).filter(included);

    const canvas = cellCanvas(cells);
    await resize(image, canvas, request.query);

    const cropped = new Map(
      await Promise.all(
        cells.map(async ({ serial, info }) => {
          const copy = await Jimp.create(image);
          const shifted = shiftCell(canvas, info);
          const result = {
            info: shifted,
            img: await crop(copy, shifted),
          };
          return [serial, result] as const;
        }),
      ),
    );

    imageCache.clear();
    const urls = await transformMapAsync(
      cropped,
      async ({ info, img }, serial) => {
        imageCache.set(serial, img);
        return {
          src: `/v3/action/image/${serial}`,
          x: info.x,
          y: info.y,
          width: info.width,
          height: info.height,
        };
      },
    );

    await transformMapAsync(urls, async ({ src }, serial) => {
      this.cells.setState(serial, {
        type: CellStateType.IMAGE,
        src,
      });
    });

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
