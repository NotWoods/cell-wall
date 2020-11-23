export type MapLike<Key, Value> = { entries(): IterableIterator<[Key, Value]> };

export function notNull<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function filterValue<Value, Result extends Value>(
  predicate: (value: Value) => value is Result,
): <Key>(entry: [Key, Value]) => entry is [Key, Result];
export function filterValue<Value>(
  predicate: (value: Value) => boolean,
): (entry: [unknown, Value]) => boolean;
export function filterValue<Value>(
  predicate: (value: Value) => boolean,
): (entry: [unknown, Value]) => boolean {
  return ([, value]) => predicate(value);
}

export function notNullValue<Key, Value>(
  entry: [Key, Value | null | undefined],
): entry is [Key, Value] {
  return filterValue(notNull)(entry);
}

export function transformMap<Key, Value, Result>(
  map: MapLike<Key, Value>,
  transform: (value: Value, key: Key) => Result,
): Map<Key, Result> {
  return new Map(
    Array.from(map.entries(), ([key, value]) => {
      return [key, transform(value, key)] as const;
    }),
  );
}

export function filterMap<Key, Value, Result extends Value>(
  map: MapLike<Key, Value>,
  predicate: (value: Value, key: Key) => value is Result,
): Map<Key, Result>;
export function filterMap<Key, Value>(
  map: MapLike<Key, Value>,
  predicate: (value: Value, key: Key) => boolean,
): Map<Key, Value>;
export function filterMap<Key, Value>(
  map: MapLike<Key, Value>,
  predicate: (value: Value, key: Key) => boolean,
): Map<Key, Value> {
  return new Map(
    Array.from(map.entries()).filter(([key, value]) => predicate(value, key)),
  );
}
