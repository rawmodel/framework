import { isHex, toString, isUndefined, isNull } from '@rawmodel/utils';

/**
 * Returns parser function which converts a value to an BSON Object string.
 */
export function bsonObjectIdStringParser() {
  return (v) => {
    if (isUndefined(v) || isNull(v)) {
      return v;
    }
    try {
      v = (toString(v) || '').replace(/\"/g, '');
      return isHex(v) && v.length === 24 ? v : null;
    } catch (e) {
      return null;
    }
  };
}
