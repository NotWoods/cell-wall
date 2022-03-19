/**
 * Memoize the result of a function
 */
export function memo<Func extends (...args: any[]) => any>(
	func: Func
): (this: ThisParameterType<Func>, ...args: Parameters<Func>) => ReturnType<Func> {
	let result: ReturnType<Func> | undefined;
	return function memoized(...args) {
		if (result === undefined) {
			result = func.apply(this, args);
		}
		return result!;
	};
}
