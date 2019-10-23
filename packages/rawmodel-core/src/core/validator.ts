import { realize } from '@rawmodel/utils';
import { ValidatorConfig, ValidatorRecipe } from './types';

/**
 * Validates `value` based on the provided `recipes`.
 * @param value Arbitrary error.
 * @param recipe Handler recipes.
 * @param config Handler configuration.
 */
export async function validate(value: any, recipes: ValidatorRecipe[] = [], config: ValidatorConfig = {}): Promise<number> {

  for (const recipe of recipes) {

    const context = realize(config.context);
    const isValid = await Promise.resolve().then(() => {
      return recipe.resolver.call(context, value);
    }).then((r) => {
      return r === true;
    });

    if (!isValid) {
      return recipe.code;
    }
  }

  return null;
}
