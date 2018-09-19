import { isString } from '@rawmodel/utils/dist/helpers/is-string';

/**
 * Returns a function for detecting values based on regular expressions.
 */
export function matchValidator(options: {
  regexp?: RegExp;
} = {}) {
  return (value?: any) => {

    if (!isString(value)) {
      return false;
    }

    const { regexp } = options;
    return regexp.test(value);
  };
}
