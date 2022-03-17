export interface CellStateImage {
	type: 'IMAGE';
	payload: string | ArrayBuffer | Blob;
	scaleType?: 'FIT_CENTER' | 'FIT_XY' | 'CENTER_INSIDE';
}
