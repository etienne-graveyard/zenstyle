import { Zs, ZsArray } from './types';

export function mergeZs<Theme>(...zss: Array<Zs<Theme>>): ZsArray<Theme> {
  return zss.map(zs => toArray(zs)).flat(1);
}

export function toArray<T>(value: T | Array<T> | undefined | null): Array<T> {
  return value === undefined || value === null
    ? []
    : Array.isArray(value)
    ? value
    : [value];
}
