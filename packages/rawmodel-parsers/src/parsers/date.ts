import { toDate } from '@rawmodel/utils';

/**
 * Returns parser function which converts a value to a date object.
 */
export function dateParser() {
  return (value: any) => {
    try {
     return toDate(value);
    } catch (e) {
      return null;
    }
  };
}
