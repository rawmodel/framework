import { stringInclusionValidator } from './string-inclusion';

/**
 * Returns a function for detecting words that do not exist in a string.
 */
export function stringExclusionValidator(options: {
  seed?: string;
}) {
  return (value?: any) => !stringInclusionValidator(options)(value);
}
