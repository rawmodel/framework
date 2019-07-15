import { realize, isArray } from '@rawmodel/utils';
import { ValidatorConfig, ValidatorRecipe } from './types';

/**
 * Validates `value` based on the provided `recipes`.
 * @param value Arbitrary error.
 * @param recipe Handler recipes.
 * @param config Handler configuration.
 */
export async function validate(value: any, recipes: ValidatorRecipe[] = [], config: ValidatorConfig = {}): Promise<number[]> {
  const codes = [];

  for (const recipe of recipes) {

    const context = realize(config.context);
    const isValid = await Promise.all(
      (isArray(value) ? value : [value])
        .map((v) => recipe.resolver.call(context, v))
    ).then((r) => r.indexOf(false) === -1);

    if (!isValid) {
      codes.push(recipe.code);
      break;
    }
  }

  return codes;
}
