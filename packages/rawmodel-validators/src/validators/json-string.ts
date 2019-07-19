import { isString } from '@rawmodel/utils/dist/helpers/is-string';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

/**
 * Returns a function for detecting JSON strings.
 */
export function jsonStringValidator() {
  return (value?: any) => {

    if (isUndefined(value) || isNull(value)) {
      return true;
    }
    else if (!isString(value)) {
      return false;
    }

    try {
      const obj = JSON.parse(value);
      return !!obj && typeof obj === 'object';
    }
    catch (e) {}

    return false;
  };
}
