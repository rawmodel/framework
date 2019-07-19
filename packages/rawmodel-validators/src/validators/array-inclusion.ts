import { isArray } from '@rawmodel/utils/dist/helpers/is-array';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

/**
 * Returns a function for detecting values that exist in the array.
 */
export function arrayInclusionValidator(options: {
  values?: any[];
} = {}) {
  return (value?: any) => {
    const { values } = options;

    return (
      isUndefined(values)
      || isNull(values)
      || isArray(values) && values.indexOf(value) !== -1
    );
  };
}
