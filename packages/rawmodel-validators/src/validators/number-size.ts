import { isNumber } from '@rawmodel/utils';

/**
 * Returns a function for detecting number size.
 */
export function numberSizeValidator(options: {
  min?: number;
  minOrEqual?: number;
  max?: number;
  maxOrEqual?: number;
} = {}) {
  return (value?: any) => {

    if (!isNumber(value)) {
      return false;
    }

    const { min, minOrEqual, max, maxOrEqual } = options;
    if (isNumber(min) && !(value > min)) {
      return false;
    }
    if (isNumber(minOrEqual) && !(value >= minOrEqual)) {
      return false;
    }
    if (isNumber(max) && !(value < max)) {
      return false;
    }
    if (isNumber(maxOrEqual) && !(value <= maxOrEqual)) {
      return false;
    }

    return true;
  };
}
