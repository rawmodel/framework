import { isArray } from '@rawmodel/utils/dist/helpers/is-array';

/**
 * Returns a function for detecting values that exist in the array.
 */
export function arrayInclusionValidator(options: {
  values?: any[];
} = {}) {
  return (value?: any) => {
    const { values } = options;

    if (!isArray(values)) {
      return false;
    }

    return values.indexOf(value) !== -1;
  };
}
