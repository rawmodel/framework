import { realize, isArray } from '@rawmodel/utils';

/**
 * Validation recipe interface.
 */
export interface ValidatorRecipe {
  code: number;
  handler: (v?: any, r?: ValidatorRecipe) => boolean | Promise<boolean>;
  condition?: (v?: any, r?: ValidatorRecipe) => boolean | Promise<boolean>;
  [key: string]: any;
}

/**
 * Validator configuration interface.
 */
export interface ValidatorConfig {
  context?: any | (() => any);
  failFast?: boolean | (() => boolean);
}

/**
 * Value validator class.
 */
export class Validator {
  readonly $config: ValidatorConfig;

  /*
   * Class constructor.
   */
  constructor(config?: ValidatorConfig) {
    Object.defineProperty(this, '$config', {
      value: { ...config },
      enumerable: false,
    });
  }

  /*
   * Validates the `value` against the recipes.
   */
  async validate(value: any, recipes: ValidatorRecipe[] = []): Promise<number[]> {
    const codes = [];

    for (const recipe of recipes) {

      const condition = recipe.condition;
      if (condition) {
        const result = await condition.call(this.$config.context, value, recipe);
        if (!result) {
          continue;
        }
      }

      const context = realize(this.$config.context);
      const isValid = await Promise.all(
        (isArray(value) ? value : [value])
          .map((v) => recipe.handler.call(context, v, recipe))
      ).then((r) => r.indexOf(false) === -1);

      if (!isValid) {
        codes.push(recipe.code);

        if (realize(this.$config.failFast)) {
          break;
        }
      }
    }

    return codes;
  }

}
