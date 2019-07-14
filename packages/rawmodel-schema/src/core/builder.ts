import { Model } from '@rawmodel/core';
import { SchemaRecipe } from './types';

/**
 * Returns a Model class generated from the provided schema recipe.
 * @param recipe Model schema recipe.
 */
export function createModel(recipe?: SchemaRecipe): typeof Model {
  const Klass = class GenericModel extends Model {};

  return Klass;
}
