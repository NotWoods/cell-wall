import { Octokit } from '@octokit/core';
import type { OctokitOptions } from '@octokit/core/dist-types/types';
import { createWriteStream, promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { promises as stream } from 'stream';
import { memo } from '../memo';

const buildTempDir = memo(() => fs.mkdtemp(join(tmpdir(), 'apk-')));

export class GithubApi {
	private readonly octokit: Octokit;

	constructor(options?: OctokitOptions) {
		this.octokit = new Octokit(options);
	}

	private fetchRelease(tag: string | undefined) {
		if (tag) {
			return this.octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
				owner: 'NotWooods',
				repo: 'cell-wall',
				tag
			});
		} else {
			return this.octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
				owner: 'NotWooods',
				repo: 'cell-wall'
			});
		}
	}

	/**
	 * Download the .apk attached to a GitHub release.
	 * @param tag Tag of release. Latest release if undefined.
	 * @returns Absolute path to written APK file, located in a temporary directory.
	 */
	async downloadApk(tag?: string): Promise<string | undefined> {
		const tmpDirReady = buildTempDir();

		const response = await this.fetchRelease(tag);
		const release = response.data;
		const asset = release.assets.find((asset) => asset.name.endsWith('.apk'));

		if (asset) {
			const res = await fetch(asset.browser_download_url);
			const tmpDirPath = await tmpDirReady;
			const destPath = join(tmpDirPath, asset.name);

			await stream.pipeline(res.body!, createWriteStream(destPath));
			return destPath;
		} else {
			throw new Error(`Could not find APK attached to release ${release.tag_name}`);
		}
	}
}
