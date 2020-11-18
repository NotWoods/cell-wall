import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import Jimp from 'jimp';

export interface ImageParserOptions {
  jimp?: Pick<typeof Jimp, 'create' | 'decoders'>;
}

export const imageParser: FastifyPluginAsync<ImageParserOptions> = async (
  app,
  options,
) => {
  const { jimp = Jimp } = options;

  function contentParser(_req: FastifyRequest, body: Buffer) {
    return jimp.create(body);
  }

  for (const mimeType of Object.keys(Jimp.decoders)) {
    app.addContentTypeParser(mimeType, { parseAs: 'buffer' }, contentParser);
  }
};
