import { Model } from './models';
import { PropDefinition } from './types';

/**
 * Returns a Model class generated from the provided properties.
 * @param recipe Model schema recipe.
 */
export function createModelClass(props: PropDefinition[]): typeof Model {
  const Klass = class GenericModel extends Model {};

  Object.defineProperty(Klass, '__props', {
    value: {},
    enumerable: false,
    configurable: true,
  });

  props.forEach((prop) => {
    Klass.__props[prop.name] = { ...prop };
  });

  return Klass;
}
