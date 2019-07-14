import { toString } from '@rawmodel/utils';

/**
 * Returns parser function which converts a value to a string.
 */
export function stringParser() {
  return (value: any) => {
    try {
     return toString(value);
    } catch (e) {
      return null;
    }
  };
}
