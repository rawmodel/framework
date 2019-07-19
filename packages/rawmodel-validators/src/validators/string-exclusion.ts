import { stringInclusionValidator } from './string-inclusion';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

/**
 * Returns a function for detecting words that do not exist in a string.
 */
export function stringExclusionValidator(options: {
  seed?: string;
} = {}) {
  return (value?: any) => (
    isUndefined(value)
    || isNull(value)
    || !stringInclusionValidator(options)(value)
  );
}
