import { isArray } from 'lodash';

export function stringToArray<T = string>(target: string, def: T[] = []): T[] {
  if (isArray(target)) return target;
  if (typeof target !== 'string' || !target.trim() || !target.includes(',')) return def;
  return target.split(',').map((s: string) => s.trim()) as any;
}

export function forceArray<T extends any[]>(target: T | string, def?: T): T {
  if (isArray(target)) return target;
  if (typeof target === 'string') return stringToArray(target, def as any) as any;
  return def as any;
}
