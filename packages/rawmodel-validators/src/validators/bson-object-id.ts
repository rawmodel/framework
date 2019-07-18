import { toString } from '@rawmodel/utils/dist/helpers/to-string';
import { isHex } from '@rawmodel/utils/dist/helpers/is-hex';

/**
 * Returns a function for detecting BSON ObjectId objects.
 */
export function bsonObjectIdValidator() {
  return (value?: any) => {

    value = (toString(value) || '').replace(/\"/g, '');

    return (
      isHex(value)
      && value.length === 24
    );
  };
}
