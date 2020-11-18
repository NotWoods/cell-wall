export async function transformMapAsync<Key, Value, Result>(
  map: { entries(): IterableIterator<[Key, Value]> },
  transform: (value: Value, key: Key) => Promise<Result>,
): Promise<Map<Key, Result>> {
  return new Map(
    await Promise.all(
      Array.from(map.entries(), async ([key, value]) => {
        return [key, await transform(value, key)] as const;
      }),
    ),
  );
}
