import { isString } from '@rawmodel/utils/dist/helpers/is-string';

/**
 * Returns a function for detecting JSON strings.
 */
export function jsonStringValidator() {
  return (value?: any) => {

    if (!isString(value)) {
      return false;
    }

    try {
      const obj = JSON.parse(value);
      return !!obj && typeof obj === 'object';
    } catch (e) {}
    return false;
  };
}
