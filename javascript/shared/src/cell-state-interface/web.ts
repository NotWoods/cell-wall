export interface CellStateWeb {
	readonly type: 'WEB';
	readonly payload: string;
}

export function webState(url: string): CellStateWeb {
	return { type: 'WEB', payload: url };
}
