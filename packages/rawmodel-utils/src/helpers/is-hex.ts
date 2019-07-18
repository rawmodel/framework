import { isString } from './is-string';

/**
 * Returns `true` if the provided value represents a hexadecimal string.
 * @param v Arbitrary value.
 */
export function isHex(v?: any) {
  return isString(v) && /^[0-9A-F]+$/i.test(v);
}
