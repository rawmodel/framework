import { isPresent } from '@rawmodel/utils/dist/helpers/is-present';

/**
 * Returns a function for detecting if the value exists.
 */
export function presenceValidator() {
  return (value?: any) => isPresent(value);
}
