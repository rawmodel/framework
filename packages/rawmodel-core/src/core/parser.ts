import { isNull, isUndefined, toArray } from '@rawmodel/utils';
import { ParserConfig, ParserRecipe } from './types';

/**
 * Parses the provided `value` based on the provided `recipe`.
 * @param value Arbitrary value.
 * @param recipe Parser recipe.
 * @param config Parser configuration.
 */
export function parse(value: any, recipe?: ParserRecipe, config?: ParserConfig) {
  recipe = !recipe ? {} : recipe;
  config = !config ? {} : config;

  const perform = (value: any) => {
    if (isUndefined(value) || isNull(value)) {
      return value;
    }
    return recipe.handler
      ? recipe.handler.call(config.context, value)
      : value;
  };

  if (isUndefined(value) || isNull(value)) {
    return value;
  } else if (recipe.array) {
    return toArray(value).map((v) => perform(v));
  } else {
    return perform(value);
  }
}
