import { isString } from '@rawmodel/utils/dist/helpers/is-string';

/**
 * Returns a function for detecting hexadecimal colors.
 */
export function hexColorValidator() {
  return (value?: any) => {

    if (!isString(value)) {
      return false;
    }

    return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(value);
  };
}
