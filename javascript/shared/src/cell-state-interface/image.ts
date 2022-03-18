export interface CellStateImage {
	readonly type: 'IMAGE';
	readonly payload: string | ArrayBuffer | Blob;
	readonly scaleType?: 'FIT_CENTER' | 'FIT_XY' | 'CENTER_INSIDE';
}
