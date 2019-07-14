import { toArray } from '@rawmodel/utils';

/**
 * Returns parser function which converts a value to an array.
 */
export function arrayParser() {
  return (value: any) => {
    try {
     return toArray(value);
    } catch (e) {
      return null;
    }
  };
}
