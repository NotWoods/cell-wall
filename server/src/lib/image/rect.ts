export interface Rectangle {
	width: number;
	height: number;
}

export interface RectangleWithPosition extends Rectangle {
	x: number;
	y: number;
}

function isNumber(number: unknown) {
	return typeof number === 'number' && !Number.isNaN(number);
}

export function validRect(
	rect: Partial<RectangleWithPosition> | undefined = {}
): rect is RectangleWithPosition {
	return isNumber(rect.x) && isNumber(rect.y) && isNumber(rect.width) && isNumber(rect.height);
}
