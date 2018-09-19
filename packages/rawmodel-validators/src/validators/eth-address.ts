import { isString } from '@rawmodel/utils/dist/helpers/is-string';

/**
 * Returns a function for detecting Ethereum address.
 */
export function ethAddressValidator() {
  return (value?: any) => {

    if (!isString(value)) {
      return false;
    }

    return /^0x[a-fA-F0-9]{40}$/i.test(value);
  };
}
