import { arrayInclusionValidator } from './array-inclusion';
import { isPresent } from '@rawmodel/utils';

/**
 * Returns a function for detecting values that do not exist in the array.
 */
export function arrayExclusionValidator(options: {
  values?: any[];
} = {}) {
  return (value?: any[]) => {

    console.log(
      !arrayInclusionValidator(options)(value)
    );

    return (
      !isPresent(value)
      || !arrayInclusionValidator(options)(value)
    );
  };
}
