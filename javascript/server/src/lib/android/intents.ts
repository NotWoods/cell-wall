import type { CellState } from '@cell-wall/shared';
import { toUri } from '../cells/state';
import { PACKAGE_NAME } from '../env';
import type { StartIntentOptions } from './adb-actions';

function displayIntent(
	serial: string,
	server: URL | string,
	state?: CellState
): StartIntentOptions {
	let dataUri: URL;
	if (state) {
		dataUri = toUri(state, server);
	} else {
		dataUri = new URL(`/cell?id=${serial}&autojoin`, server);
	}

	return {
		action: `${PACKAGE_NAME}.DISPLAY`,
		dataUri,
		waitForLaunch: true
	};
}
