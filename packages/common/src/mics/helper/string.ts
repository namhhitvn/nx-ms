import { isNumber, isString } from 'lodash';

export function forceString(target: any, def = ''): string {
  return isNumber(target) && !isNaN(target) ? String(target) : isString(target) ? target : def;
}
