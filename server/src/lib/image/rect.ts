export interface Rectangle {
	width: number;
	height: number;
}

export interface RectangleWithPosition extends Rectangle {
	x: number;
	y: number;
}
