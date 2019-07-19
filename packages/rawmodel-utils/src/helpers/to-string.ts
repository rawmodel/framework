import { isUndefined } from './is-undefined';
import { isNull } from './is-null';
import { isString } from './is-string';
import { isNumber } from './is-number';
import { isInfinite } from './is-infinite';

/**
 * Converts the provided value to string.
 * @param v Arbitrary value.
 */
export function toString(v?: any) {
  if (isString(v) || isUndefined(v) || isNull(v)) {
    return v;
  }
  else if (isNumber(v) && (isNaN(v) || isInfinite(v))) {
    return null;
  }
  else {
    return JSON.stringify(v);
  }
}
