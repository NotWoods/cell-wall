import { MapLike } from './sync-map';

export type PairIterable<K, V> = Iterable<[K, V]>;

type MapLikeUnknown = MapLike<unknown, unknown>;

export function entries<K extends keyof any, V>(
  map: MapLike<K, V> | Record<K, V>,
): PairIterable<K, V>;
export function entries<K, V>(map: MapLike<K, V>): PairIterable<K, V>;
export function entries<T>(obj: T): PairIterable<keyof T, T[keyof T]>;
export function entries(obj: MapLikeUnknown | object): PairIterable<any, any> {
  const map = obj as MapLikeUnknown;
  if (typeof map.entries === 'function') {
    return map.entries();
  } else {
    return Object.entries(obj);
  }
}
