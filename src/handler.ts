/**
 * Error handler recipe interface.
 */
export interface HandlerRecipe {
  code: number;
  handler: (v?: any, r?: HandlerRecipe) => boolean | Promise<boolean>;
  condition?: (v?: any, r?: HandlerRecipe) => boolean | Promise<boolean>;
  [key: string]: any;
}

/**
 * Error handler configuration interface.
 */
export interface HandlerConfig {
  ctx?: any | (() => any);
  failFast?: boolean | (() => boolean);
}

/**
 * Error handler class.
 */
export class Handler {
  readonly $config: HandlerConfig;

  /*
   * Class constructor.
   */
  constructor(config?: HandlerConfig) {
    Object.defineProperty(this, '$config', {
      value: { ...config },
      enumerable: false,
    });
  }

  /*
   * Handles the error against the recipes.
   */
  async handle(error: any, recipes: HandlerRecipe[] = []): Promise<number[]> {
    const codes = [];

    for (let recipe of recipes) {

      const condition = recipe.condition;
      if (condition) {
        const result = await condition.call(this.$config.ctx, error, recipe);
        if (!result) {
          continue;
        }
      }

      const context = typeof this.$config.ctx === 'function'
        ? this.$config.ctx()
        : this.$config.ctx;
      const isMatch = await Promise.all(
        (Array.isArray(error) ? error : [error])
          .map((v) => recipe.handler.call(context, v, recipe))
      ).then((r) => r.indexOf(false) === -1);

      if (isMatch) {
        codes.push(recipe.code);

        const failFast = typeof this.$config.failFast === 'function'
          ? this.$config.failFast()
          : this.$config.failFast;
        if (failFast) {
          break;
        }
      }
    }

    return codes;
  }

}
