import { Prop } from './props';
import { Model } from './models';
import { Validator, ValidatorRecipe } from '@rawmodel/validator';
import { Handler, HandlerRecipe } from '@rawmodel/handler';
import { CustomParserHandler } from '@rawmodel/parser';

/**
 * Model configuration interface.
 */
export interface ModelConfig<Context> {
  context?: Context | (() => Context);
  failFast?: boolean | (() => boolean);
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
 * Parser kinds.
 */
export enum ParserKind {
  STRING = 'string',
  BOOLEAN = 'boolean',
  INTEGER = 'integer',
  FLOAT = 'float',
  DATE = 'date',
  ARRAY = 'array',
  CUSTOM = 'custom',
  ANY = 'any',
  MODEL = 'model',
}

/**
 * Property parser configurations.
 */
export type Parser = PrimitiveParserConfig | ArrayParserConfig | CustomParserConfig | ModelParserConfig;

/**
 * Primitive parser interface.
 */
export interface PrimitiveParserConfig {
  kind: ParserKind.STRING | ParserKind.BOOLEAN | ParserKind.INTEGER |
    ParserKind.FLOAT | ParserKind.DATE | ParserKind.ANY;
}

/**
 * Array parser interface.
 */
export interface ArrayParserConfig {
  kind: ParserKind.ARRAY;
  parse?: PrimitiveParserConfig | CustomParserConfig | ModelParserConfig; // not supporting tuples
}

/**
 * Custom parser interface.
 */
export interface CustomParserConfig {
  kind: ParserKind.CUSTOM;
  handler: CustomParserHandler;
}
/**
 * Model parser interface.
 */
export interface ModelParserConfig {
  kind: ParserKind.MODEL;
  model: typeof Model;
}

/**
 * Model property class configuration object.
 */
export interface PropConfig {
  set?: (v: any) => any;
  get?: (v: any) => any;
  parse?: Parser;
  defaultValue?: any | (() => any);
  fakeValue?: any | (() => any);
  emptyValue?: any | (() => any);
  validator?: Validator | (() => Validator);
  validate?: ValidatorRecipe[];
  handler?: Handler | (() => Handler);
  handle?: HandlerRecipe[];
  populatable?: string[];
  serializable?: string[];
  enumerable?: boolean;
  model?: Model;
}
