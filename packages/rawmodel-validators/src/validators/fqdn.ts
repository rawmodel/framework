import { isString } from '@rawmodel/utils/dist/helpers/is-string';

/**
 * Returns a function for detecting domain names.
 */
export function fqdnValidator(options: {
  requireTld?: boolean;
  allowUnderscores?: boolean;
  allowTrailingDot?: boolean;
} = {}) {
	return (value?: any) => {

		const { requireTld = true, allowUnderscores = false, allowTrailingDot = false } = options;

		if (!isString(value)) {
			return false;
		}

		if (allowTrailingDot && value[value.length - 1] === '.') {
			value = value.substring(0, value.length - 1);
		}

		const parts = value.split('.');

		if (requireTld) {
			const tld = parts.pop();

			if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
				return false;
			}
		}

		for (let part, i = 0; i < parts.length; i++) {
			part = parts[i];

			if (allowUnderscores) {
				if (part.indexOf('__') >= 0) {
					return false;
				} else {
					part = part.replace(/_/g, '');
				}
			}

			if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
				return false;
			} else if (/[\uff01-\uff5e]/.test(part)) {
				return false; // disallow full-width chars
			} else if (part[0] === '-' || part[part.length - 1] === '-') {
				return false;
			}
		}

		return true;
	};
}
