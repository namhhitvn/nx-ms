import { isNumber } from 'lodash';

export function forceNumber(target: any, def = 0): number {
  const result = +target;
  return !isNumber(result) && !isNaN(result) ? def : result;
}
