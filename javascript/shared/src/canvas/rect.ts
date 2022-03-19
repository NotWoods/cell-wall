export interface Rectangle {
	width: number;
	height: number;
}

export interface Position {
	x: number;
	y: number;
}

export type RectangleWithPosition = Rectangle & Position;

function isNumber(number: unknown) {
	return typeof number === 'number' && !Number.isNaN(number);
}

export function validRect(
	rect: Partial<RectangleWithPosition> | undefined = {}
): rect is RectangleWithPosition {
	return isNumber(rect.x) && isNumber(rect.y) && isNumber(rect.width) && isNumber(rect.height);
}
