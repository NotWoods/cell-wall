import type { FastifyInstance, FastifyRequest } from 'fastify';
import type Jimp from 'jimp';

type JimpInstance = Pick<typeof Jimp, 'create' | 'decoders'>;

export interface ImageParserOptions {
	jimp?: JimpInstance | PromiseLike<JimpInstance>;
}

const MB = 1048576;

async function defaultJimp() {
	const module = await import('jimp');
	return module.default;
}

/**
 * Parse image bodies into Jimp images
 */
export async function imagePlugin(
	fastify: FastifyInstance,
	options: ImageParserOptions = {}
): Promise<void> {
	const jimp: JimpInstance = await (options.jimp ?? defaultJimp());

	async function contentParser(_request: FastifyRequest, body: Buffer) {
		return await jimp.create(body);
	}

	for (const mimeType of Object.keys(jimp.decoders)) {
		fastify.addContentTypeParser(mimeType, { parseAs: 'buffer', bodyLimit: 5 * MB }, contentParser);
	}
}
