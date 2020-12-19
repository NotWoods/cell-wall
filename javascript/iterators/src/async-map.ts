import { MapLike } from './sync-map';

/**
 * Run `transform` over every entry in the map in parallel.
 */
export async function transformMapAsync<Key, Value, Result>(
  map: MapLike<Key, Value>,
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

export async function forEachMapAsync<Key, Value>(
  map: MapLike<Key, Value>,
  transform: (value: Value, key: Key) => Promise<void>,
): Promise<void> {
  await Promise.all(
    Array.from(map.entries(), async ([key, value]) => {
      await transform(value, key);
    }),
  );
}
