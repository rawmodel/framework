import { toFloat } from '@rawmodel/utils';

/**
 * Returns parser function which converts a value to a decimal number.
 */
export function floatParser() {
  return (value: any) => {
    try {
      return toFloat(value);
    } catch (e) {
      return null;
    }
  };
}
