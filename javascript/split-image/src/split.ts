import Jimp from 'jimp';
import { cellCanvas, CellInfo, shiftCell } from '@cell-wall/cells';
import { transformMapAsync } from '@cell-wall/iterators';
import { crop, CropProps, resize, ResizeOptions } from './manipulate.js';

export async function splitImage(
  image: Jimp,
  cells: Map<string, Pick<CellInfo, CropProps>>,
  options: ResizeOptions = {},
) {
  const canvas = cellCanvas(cells.values());
  await resize(image, canvas, options);

  return await transformMapAsync(cells, async (info) => {
    const copy = await Jimp.create(image);
    const shifted = shiftCell(canvas, info);
    return {
      info: shifted,
      img: await crop(copy, shifted),
    };
  });
}
