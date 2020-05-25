import { isFloat } from './is-float';
import { isUndefined } from './is-undefined';
import { isNull } from './is-null';
import { isInteger } from './is-integer';
import { toBoolean } from './to-boolean';

/**
 * Converts the provided value to integer.
 * @param v Arbitrary value.
 */
export function toInteger(v?: any) {
  if (isInteger(v) || isUndefined(v) || isNull(v)) {
    return v;
  } else if (isFloat(v)) {
    return parseInt(v);
  } else {
    const pv = parseInt(v);
    if (isInteger(pv)) {
      return pv;
    } else if (toBoolean(v)) {
      return 1;
    } else {
      return 0;
    }
  }
}
