import type { Rectangle, RectangleWithPosition } from '@cell-wall/shared';

export function fitScale(container: Rectangle, canvas: Rectangle) {
	const { width, height } = canvas;
	const widthScale = container.width / width;
	const heightScale = container.height / height;
	return Math.min(widthScale, heightScale);
}

export function applyScale(rect: RectangleWithPosition, scale: number) {
	const { x, y, width, height } = rect;
	return {
		x: x * scale,
		y: y * scale,
		width: width * scale,
		height: height * scale
	};
}
