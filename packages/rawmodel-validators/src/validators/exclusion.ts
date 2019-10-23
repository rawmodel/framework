import { inclusionValidator } from './inclusion';
import { isPresent } from '@rawmodel/utils';

/**
 * Returns a function for detecting values that do not exist in the array.
 */
export function exclusionValidator(options: {
  values?: any[];
} = {}) {
  return (value?: any) => {
    return (
      !isPresent(value)
      || !inclusionValidator(options)(value)
    );
  };
}
