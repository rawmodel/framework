import { isString } from '@rawmodel/utils/dist/helpers/is-string';

/**
 * Returns a function for detecting lower cased strings.
 */
export function downcaseStringValidator() {
  return (value?: any) => {

    if (!isString(value)) {
      return false;
    }

    return value === value.toLowerCase();
  };
}
