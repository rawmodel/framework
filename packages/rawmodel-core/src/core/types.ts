import { Prop } from './props';
import { Model } from './models';

/**
 * Model configuration interface.
 */
export interface ModelConfig<Context = any> {
  context?: Context | (() => Context);
  parent?: Model;
}

/**
 * Property path.
 */
export type PropPath = (string | number)[];

/**
 * Property error interface.
 */
export interface PropError {
  path: PropPath;
  errors: number[];
}

/**
 * Model property class configuration object.
 */
export interface PropItem {
  path: PropPath;
  prop: Prop;
  value: any;
}

/**
 * Model property class configuration object.
 */
export interface PropConfig {
  set?: (v: any) => any;
  get?: (v: any) => any;
  parse?: ParserRecipe;
  failFast?: boolean | (() => boolean);
  defaultValue?: any | (() => any);
  fakeValue?: any | (() => any);
  emptyValue?: any | (() => any);
  validate?: ValidatorRecipe[];
  handle?: HandlerRecipe[];
  populatable?: string[];
  serializable?: string[];
  enumerable?: boolean;
  model?: Model;
}

/**
 * Parser recipe interface.
 */
export interface ParserRecipe {
  array?: boolean;
  resolver?: ParserResolver;
}

/**
 * Parser resolver definition.
 */
export type ParserResolver = ((v?: any, r?: ParserRecipe) => any) | typeof Model;

/**
 * Parser configuration interface.
 */
export interface ParserConfig {
  context?: any | (() => any);
}

/**
 * Validation recipe interface.
 */
export interface ValidatorRecipe {
  code: number;
  resolver: ValidatorResolver;
}

/**
 * Validator handler definition.
 */
export type ValidatorResolver = (v?: any, r?: ValidatorRecipe) => (boolean | Promise<boolean>);

/**
 * Validator configuration interface.
 */
export interface ValidatorConfig {
  context?: any | (() => any);
}

/**
 * Error handler recipe interface.
 */
export interface HandlerRecipe {
  code: number;
  resolver: HandlerResolver;
}

/**
 * Handler handler definition.
 */
export type HandlerResolver = (v?: any, r?: HandlerRecipe) => (boolean | Promise<boolean>);

/**
 * Error handler configuration interface.
 */
export interface HandlerConfig {
  context?: any | (() => any);
}
