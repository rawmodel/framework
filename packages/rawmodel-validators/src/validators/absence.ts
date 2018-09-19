import { isPresent } from '@rawmodel/utils/dist/helpers/is-present';

/**
 * Returns a function for detecting empty values.
 */
export function absenceValidator() {
  return (value?: any) => {
    return !isPresent(value);
  };
}
