import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import Jimp from 'jimp';

export interface ImageParserOptions {
  jimp?: Pick<typeof Jimp, 'create' | 'decoders'>;
}

const MB = 1048576;

export const imageParser: FastifyPluginAsync<ImageParserOptions> = async (
  app,
  options,
) => {
  const { jimp = Jimp } = options;

  async function contentParser(_request: FastifyRequest, body: Buffer) {
    return await jimp.create(body);
  }

  for (const mimeType of Object.keys(Jimp.decoders)) {
    app.addContentTypeParser(
      mimeType,
      { parseAs: 'buffer', bodyLimit: 5 * MB },
      contentParser,
    );
  }
};
