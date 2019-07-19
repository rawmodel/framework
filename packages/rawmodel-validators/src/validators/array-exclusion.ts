import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';
import { arrayInclusionValidator } from './array-inclusion';

/**
 * Returns a function for detecting values that do not exist in the array.
 */
export function arrayExclusionValidator(options: {
  values?: any[];
} = {}) {
  return (value?: any) => {
    return (
      isUndefined(value)
      || isNull(value)
      || !arrayInclusionValidator(options)(value)
    );
  };
}
