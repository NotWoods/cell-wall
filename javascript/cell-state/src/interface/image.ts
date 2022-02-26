export interface CellStateImage {
	type: 'IMAGE';
	/** Can also send Blob to update image */
	src: string;
	scaleType?: 'FIT_CENTER' | 'FIT_XY' | 'CENTER_INSIDE';
}
