import { isString } from '@rawmodel/utils/dist/helpers/is-string';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

/**
 * Returns a function for detecting hexadecimal colors.
 */
export function hexColorValidator() {
  return (value?: any) => {
    return (
      isUndefined(value)
      || isNull(value)
      || isString(value) && /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(value)
    );
  };
}
