export interface CellStateWeb {
	type: 'WEB';
	/** Can also send ArrayBuffer to update site */
	url: string;
}

export function webState(url: string): CellStateWeb {
	return { type: 'WEB', url };
}
