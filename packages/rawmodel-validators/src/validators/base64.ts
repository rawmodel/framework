import { isString } from '@rawmodel/utils/dist/helpers/is-string';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

const BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;

/**
 * Returns a function for detecting base64 strings.
 */
export function base64Validator() {
  return (value?: any) => {
    return (
      isUndefined(value)
      || isNull(value)
      || isString(value) && BASE64_REGEX.test(value)
    );
  };
}
