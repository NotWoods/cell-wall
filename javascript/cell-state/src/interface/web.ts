export interface CellStateWeb {
	type: 'WEB';
	payload: string;
}

export function webState(url: string): CellStateWeb {
	return { type: 'WEB', payload: url };
}
