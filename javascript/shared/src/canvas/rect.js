function isNumber(number) {
    return typeof number === 'number' && !Number.isNaN(number);
}
export function validRect(rect = {}) {
    return isNumber(rect.width) && isNumber(rect.height);
}
export function validRectWithPos(rect = {}) {
    return isNumber(rect.x) && isNumber(rect.y) && validRect(rect);
}
//# sourceMappingURL=rect.js.map