import type { RequestHandler } from '@sveltejs/kit';
import { assets } from '$app/paths';
import { repo } from '$lib/repository';

export const post: RequestHandler<Record<string, never>, FormData> = async function post({
	host,
	body
}) {
	const preset = body.get('preset');

	const presetResponse = await fetch(`https://${host}${assets}/preset/${preset}.json`);
	const presetStates = await presetResponse.json();

	await repo.setStates(presetStates);

	return {
		body: Object.keys(presetStates)
	};
};
