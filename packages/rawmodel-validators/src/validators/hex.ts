import { isHex } from '@rawmodel/utils/dist/helpers/is-hex';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

/**
 * Returns a function for detecting hexadecimal values.
 */
export function hexValidator() {
  return (value?: any) => (
    isUndefined(value)
    || isNull(value)
    || isHex(value)
  );
}
