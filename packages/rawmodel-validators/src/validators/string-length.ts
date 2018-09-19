import { isString } from '@rawmodel/utils/dist/helpers/is-string';
import { isNumber } from '@rawmodel/utils/dist/helpers/is-number';

/**
 * Returns a function for detecting string length.
 */
export function stringLengthValidator(recipe: {
  bytes?: boolean;
  min?: number;
  minOrEqual?: number;
  max?: number;
  maxOrEqual?: number;
} = {}) {
  return (value?: any) => {

    if (!isString(value)) return false;

    const { bytes = false, min, minOrEqual, max, maxOrEqual } = recipe;
    const len = bytes
      ? encodeURI(value).split(/%..|./).length - 1
      : value.length;

    if (isNumber(min) && !(len > min)) {
      return false;
    }
    if (isNumber(minOrEqual) && !(len >= minOrEqual)) {
      return false;
    }
    if (isNumber(max) && !(len < max)) {
      return false;
    }
    if (isNumber(maxOrEqual) && !(len <= maxOrEqual)) {
      return false;
    }

    return true;
  };
}
