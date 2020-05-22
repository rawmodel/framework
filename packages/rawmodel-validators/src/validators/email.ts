import { isString } from '@rawmodel/utils/dist/helpers/is-string';
import { fqdnValidator } from './fqdn';
import { stringLengthValidator } from './string-length';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

const DISPLAY_NAME_REGEX = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
const EMAIL_USER_REGEX = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
const QUOTED_EMAIL_USER_REGEX = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
const EMAIL_USER_UTF8_REGEX = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
const QUOTED_EMAIL_USER_UTF8_REGEX = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;

/**
 * Returns a function for detecting email strings.
 */
export function emailValidator(recipe: {
  allowDisplayName?: boolean;
  allowUtf8LocalPart?: boolean;
  requireTld?: boolean;
} = {}) {
  return (value?: any) => {

    if (isUndefined(value) || isNull(value)) {
      return true;
    } else if (!isString(value)) {
      return false;
    }

    const { allowDisplayName = false, allowUtf8LocalPart = false, requireTld = true } = recipe;
    if (allowDisplayName) {
      const displayEmail = value.match(DISPLAY_NAME_REGEX);
      if (displayEmail) {
        value = displayEmail[1];
      }
    }

    const parts = value.split('@');
    const domain = parts.pop();
    let user = parts.join('@');
    const lowerDomain = domain.toLowerCase();
    if (lowerDomain === 'gmail.com' || lowerDomain === 'googlemail.com') {
      user = user.replace(/\./g, '').toLowerCase();
    }

    if (!stringLengthValidator({ bytes: true, max: 64 })(user) || !stringLengthValidator({ bytes: true, max: 256 })(domain)) {
      return false;
    } else if (!fqdnValidator({ requireTld })(domain)) {
      return false;
    } else if (user[0] === '"') {
      user = user.slice(1, user.length - 1);
      return allowUtf8LocalPart
        ? QUOTED_EMAIL_USER_UTF8_REGEX.test(user)
        : QUOTED_EMAIL_USER_REGEX.test(user);
    }

    const pattern = allowUtf8LocalPart
      ? EMAIL_USER_UTF8_REGEX
      : EMAIL_USER_REGEX;
    const userParts = user.split('.');
    for (const userPart of  userParts) {
      if (!pattern.test(userPart)) {
        return false;
      }
    }

    return true;
  };
}
