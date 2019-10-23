import { realize } from '@rawmodel/utils';
import { HandlerConfig, HandlerRecipe } from './types';

/**
 * Handles `error` based on the provided `recipes`.
 * @param value Arbitrary error.
 * @param recipe Handler recipes.
 * @param config Handler configuration.
 */
export async function handle(error: any, recipes: HandlerRecipe[] = [], config: HandlerConfig = {}): Promise<number> {

  for (const recipe of recipes) {

    const context = realize(config.context);
    const isMatch = await Promise.resolve().then(() => {
      return recipe.resolver.call(context, error);
    }).then((r) => {
      return r === true;
    });

    if (isMatch) {
      return recipe.code;
    }
  }

  return null;
}
