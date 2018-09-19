import { isArray } from '@rawmodel/utils/dist/helpers/is-array';
import { isNumber } from '@rawmodel/utils/dist/helpers/is-number';

/**
 * Returns a function for detecting array size.
 */
export function arrayLengthValidator(options: {
  min?: number;
  minOrEqual?: number;
  max?: number;
  maxOrEqual?: number;
} = {}) {
  return (value?: any) => {

    if (!isArray(value)) {
      return false;
    }

    const size = value.length;
    const { min, minOrEqual, max, maxOrEqual } = options;
    if (isNumber(min) && !(size > min)) {
      return false;
    }
    if (isNumber(minOrEqual) && !(size >= minOrEqual)) {
      return false;
    }
    if (isNumber(max) && !(size < max)) {
      return false;
    }
    if (isNumber(maxOrEqual) && !(size <= maxOrEqual)) {
      return false;
    }

    return true;
  };
}
