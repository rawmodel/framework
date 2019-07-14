import { toInteger } from '@rawmodel/utils';

/**
 * Returns parser function which converts a value to an integer number.
 */
export function integerParser() {
  return (value: any) => {
    try {
      return toInteger(value);
    } catch (e) {
      return null;
    }
  };
}
