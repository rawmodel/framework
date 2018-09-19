import { toString } from '@rawmodel/utils/dist/helpers/to-string';
import { hexValidator } from './hex';

/**
 * Returns a function for detecting BSON ObjectId objects.
 */
export function bsonObjectIdValidator() {
  return (value?: any) => {

    value = toString(value);

    return (
      hexValidator()(value)
      && value.length === 24
    );
  };
}
