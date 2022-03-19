/**
 * Memoize the result of a function
 */
export function memo(func) {
    let result;
    return function memoized(...args) {
        if (result === undefined) {
            result = func.apply(this, args);
        }
        return result;
    };
}
//# sourceMappingURL=memo.js.map