export function createBlobUrlFactory(): (blob: Blob | string) => string {
	let lastUrl = '';
	return function createBlobUrl(blob: Blob | string) {
		if (lastUrl.startsWith('blob:')) {
			URL.revokeObjectURL(lastUrl);
		}

		if (typeof blob === 'string') {
			lastUrl = blob;
		} else {
			lastUrl = URL.createObjectURL(blob);
		}
		return lastUrl;
	};
}
