import { isArray } from './is-array';
import { isUndefined } from './is-undefined';
import { isNull } from './is-null';

/**
 * Converts the provided value to array.
 * @param v Arbitrary value.
 */
export function toArray(v?: any): Array<any> {
  if (isArray(v) || isUndefined(v) || isNull(v)) {
    return v;
  }
  else {
    return [v];
  }
}
