import { isString } from '@rawmodel/utils/dist/helpers/is-string';
import { isNumber } from '@rawmodel/utils/dist/helpers/is-number';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

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

    if (isUndefined(value) || isNull(value)) {
      return true;
    } else if (!isString(value)) {
      return false;
    }

    const { bytes = false, min, minOrEqual, max, maxOrEqual } = recipe;
    const len = bytes
      ? encodeURI(value).split(/%..|./).length - 1
      : value.length;

    if (isNumber(min) && !(len > min)) {
      return false;
    } else if (isNumber(minOrEqual) && !(len >= minOrEqual)) {
      return false;
    } else if (isNumber(max) && !(len < max)) {
      return false;
    } else if (isNumber(maxOrEqual) && !(len <= maxOrEqual)) {
      return false;
    }
    return true;
  };
}
