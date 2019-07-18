import { isHex } from '@rawmodel/utils/dist/helpers/is-hex';

/**
 * Returns a function for detecting hexadecimal values.
 */
export function hexValidator() {
  return (value?: any) => isHex(value);
}
