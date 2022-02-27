export function createBlobUrlFactory(): (blob: ArrayBuffer | Blob | string) => string {
	let lastUrl = '';
	return function createBlobUrl(blob: ArrayBuffer | Blob | string) {
		if (lastUrl.startsWith('blob:')) {
			URL.revokeObjectURL(lastUrl);
		}

		if (typeof blob === 'string') {
			lastUrl = blob;
		} else {
			if (!(blob instanceof Blob)) {
				blob = new Blob([blob]);
			}
			lastUrl = URL.createObjectURL(blob);
		}
		return lastUrl;
	};
}
