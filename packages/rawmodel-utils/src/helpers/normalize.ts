import { isUndefined } from './is-undefined';
import { isNull } from './is-null';

/**
 * Converts the provided data to primitive data type.
 */
export function normalize(data: any) {
  if (isUndefined(data) || isNull(data)) {
    return data;
  }
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (e) {
    return data;
  }
}
