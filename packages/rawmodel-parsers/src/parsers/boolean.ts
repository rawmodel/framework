import { toBoolean } from '@rawmodel/utils';

/**
 * Returns parser function which converts a value to a boolean value.
 */
export function booleanParser() {
  return (value: any) => {
    try {
     return toBoolean(value);
    } catch (e) {
      return null;
    }
  };
}
