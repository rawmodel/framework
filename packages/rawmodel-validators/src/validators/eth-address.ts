import { isString } from '@rawmodel/utils/dist/helpers/is-string';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

/**
 * Returns a function for detecting Ethereum address.
 */
export function ethAddressValidator() {
  return (value?: any) => {
    return (
      isUndefined(value)
      || isNull(value)
      || isString(value) && /^0x[a-fA-F0-9]{40}$/i.test(value)
    );
  };
}
