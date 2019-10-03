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
  code: number;
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
  getter?: SimpleResolver;
  setter?: SimpleResolver;
  parser?: ParserRecipe;
  defaultValue?: any | SimpleResolver;
  fakeValue?: any | SimpleResolver;
  emptyValue?: any | SimpleResolver;
  validators?: ValidatorRecipe[];
  handlers?: HandlerRecipe[];
  populatable?: string[];
  serializable?: string[];
  enumerable?: boolean;
  model?: Model;
}

/**
 * Model property class configuration object.
 */
export interface PropDefinition extends PropConfig {
  name: string;
}

/**
 * Parser recipe interface.
 */
export interface ParserRecipe {
  array?: boolean;
  resolver?: ParserResolver;
}

/**
 * Simple data resolver.
 */
export type SimpleResolver = (v?: any) => any;

/**
 * Parser resolver definition.
 */
export type ParserResolver = SimpleResolver | any;

/**
 * Parser configuration interface.
 */
export interface ParserConfig {
  context?: any | SimpleResolver;
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
export type ValidatorResolver = (v?: any) => (boolean | Promise<boolean>);

/**
 * Validator configuration interface.
 */
export interface ValidatorConfig {
  context?: any | SimpleResolver;
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
export type HandlerResolver = (v?: any) => (boolean | Promise<boolean>);

/**
 * Error handler configuration interface.
 */
export interface HandlerConfig {
  context?: any | SimpleResolver;
}
