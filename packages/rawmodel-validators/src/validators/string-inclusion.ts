import { isString } from '@rawmodel/utils/dist/helpers/is-string';
import { toString } from '@rawmodel/utils/dist/helpers/to-string';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

/**
 * Returns a function for detecting words that exist in a string.
 */
export function stringInclusionValidator(options?: { seed?: string }) {
  return (value?: any) => {

    if (isUndefined(value) || isNull(value)) {
      return true;
    }
    else if (!isString(value)) {
      return false;
    }

    const { seed } = { ...options };
    return value.indexOf(toString(seed)) >= 0;
  };
}
