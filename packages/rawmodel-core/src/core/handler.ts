import { realize, isArray } from '@rawmodel/utils';
import { HandlerConfig, HandlerRecipe } from './types';

/**
 * Handles `error` based on the provided `recipes`.
 * @param value Arbitrary error.
 * @param recipe Handler recipes.
 * @param config Handler configuration.
 */
export async function handle(error: any, recipes: HandlerRecipe[] = [], config: HandlerConfig = {}): Promise<number[]> {
  const codes = [];

  for (const recipe of recipes) {

    const condition = recipe.condition;
    if (condition) {
      const result = await condition.call(config.context, error, recipe);
      if (!result) {
        continue;
      }
    }

    const context = realize(config.context);
    const isMatch = await Promise.all(
      (isArray(error) ? error : [error])
        .map((v) => recipe.handler.call(context, v, recipe))
    ).then((r) => r.indexOf(false) === -1);

    if (isMatch) {
      codes.push(recipe.code);

      if (realize(config.failFast)) {
        break;
      }
    }
  }

  return codes;
}
