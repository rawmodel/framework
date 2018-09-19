import { isString } from '@rawmodel/utils/dist/helpers/is-string';

/**
 * Returns a function for detecting uppercased string.
 */
export function upcaseStringValidator() {
  return (value?: any) => {

    if (!isString(value)) {
      return false;
    }

    return value === value.toUpperCase();
  };
}
