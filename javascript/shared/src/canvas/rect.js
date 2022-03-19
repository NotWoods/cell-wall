function isNumber(number) {
    return typeof number === 'number' && !Number.isNaN(number);
}
export function validRect(rect = {}) {
    return isNumber(rect.x) && isNumber(rect.y) && isNumber(rect.width) && isNumber(rect.height);
}
//# sourceMappingURL=rect.js.map