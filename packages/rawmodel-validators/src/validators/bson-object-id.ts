import { toString } from '@rawmodel/utils/dist/helpers/to-string';
import { isHex } from '@rawmodel/utils/dist/helpers/is-hex';
import { isUndefined } from '@rawmodel/utils/dist/helpers/is-undefined';
import { isNull } from '@rawmodel/utils/dist/helpers/is-null';

/**
 * Returns a function for detecting BSON ObjectId objects.
 */
export function bsonObjectIdValidator() {
  return (value?: any) => {

    if (isUndefined(value) || isNull(value)) {
      return true;
    }

    value = (toString(value) || '').replace(/\"/g, '');
    return (
      isHex(value)
      && value.length === 24
    );
  };
}
