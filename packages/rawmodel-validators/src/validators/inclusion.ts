import { isArray } from '@rawmodel/utils/dist/helpers/is-array';
import { isPresent } from '@rawmodel/utils';

/**
 * Returns a function for detecting values that exist in the array.
 */
export function inclusionValidator(options: {
  values?: any[];
} = {}) {
  return (value?: any) => {
    const { values } = { ...options };

    return (
      !isPresent(value)
      || !isArray(values)
      || isArray(values) && values.indexOf(value) !== -1
    );
  };
}
