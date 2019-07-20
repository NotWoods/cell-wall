/**
 * Make an iterator that aggregates elements from each of the iterables.
 */
export function zip<A, B>(
    a: Iterable<A>,
    b: Iterable<B>,
): IterableIterator<[A, B]>;
export function* zip<T>(...iterables: Iterable<T>[]): IterableIterator<T[]> {
    const iterators = iterables.map(it => it[Symbol.iterator]());
    while (iterators.length > 0) {
        const result = [];
        for (const it of iterators) {
            const { done, value } = it.next();
            if (done) return;
            result.push(value);
        }
        yield result;
    }
}

/**
 * Yields tuples containing a count (from `start` which defaults to 0) and the
 * values obtained when iterating over `iterable`.
 * @param sequence
 * @param start
 */
export function* enumerate<T>(sequence: Iterable<T>, start = 0) {
    let n = start;
    for (const elem of sequence) {
        yield [n, elem] as [number, T];
        n++;
    }
}

/**
 * Return elements of set a that are not in set b.
 */
export function difference<T>(a: Iterable<T>, b: ReadonlySet<T>): T[] {
    return [...a].filter(x => !b.has(x));
}
