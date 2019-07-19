import { isString } from '@rawmodel/utils/dist/helpers/is-string';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

/**
 * Returns a function for detecting lower cased strings.
 */
export function downcaseStringValidator() {
  return (value?: any) => {
    return (
      isUndefined(value)
      || isNull(value)
      || isString(value) && value === value.toLowerCase()
    );
  };
}
