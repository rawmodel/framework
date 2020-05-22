import { isString } from '@rawmodel/utils/dist/helpers/is-string';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

/**
 * Returns a function for detecting values based on regular expressions.
 */
export function matchValidator(options: {
  regexp?: RegExp;
} = {}) {
  return (value?: any) => {

    if (isUndefined(value) || isNull(value)) {
      return true;
    } else if (!isString(value)) {
      return false;
    }

    const { regexp } = { ...options };
    return regexp.test(value);
  };
}
