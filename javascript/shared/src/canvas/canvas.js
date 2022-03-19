const AXIS_TO_POS = new Map()
    .set('width', 'x')
    .set('height', 'y');
export function cellCanvas(cells) {
    const canvas = { x: Infinity, y: Infinity, width: 0, height: 0 };
    for (const info of cells) {
        for (const [axis, pos] of AXIS_TO_POS) {
            const value = info[pos] + info[axis];
            if (!Number.isNaN(value)) {
                canvas[pos] = Math.min(canvas[pos], info[pos]);
                canvas[axis] = Math.max(canvas[axis], info[pos] + info[axis]);
            }
        }
    }
    canvas.width = canvas.width - canvas.x;
    canvas.height = canvas.height - canvas.y;
    return canvas;
}
export function shiftCell(canvas, cell) {
    const copy = { ...cell };
    copy.x = cell.x - canvas.x;
    copy.y = cell.y - canvas.y;
    return copy;
}
//# sourceMappingURL=canvas.js.map