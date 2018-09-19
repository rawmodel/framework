import { isString } from '@rawmodel/utils/dist/helpers/is-string';

/**
 * Returns a function for detecting hexadecimal values.
 */
export function hexValidator() {
  return (value?: any) => {

    if (!isString(value)) {
      return false;
    }

    return /^[0-9A-F]+$/i.test(value);
  };
}
