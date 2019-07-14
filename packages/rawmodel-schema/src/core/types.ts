import { ParserResolver, ValidatorResolver, HandlerResolver } from '@rawmodel/core';

/**
 * Schema recipe for creating a model.
 */
export interface SchemaRecipe {
  context?: any;
  getters?: { [name: string]: ((v: any) => any) };
  setters?: { [name: string]: ((v: any) => any) };
  defaultValues?: { [name: string]: (any | (() => any)) };
  fakeValues?: { [name: string]: (any | (() => any)) };
  emptyValues?: { [name: string]: (any | (() => any)) };
  parsers?: { [name: string]: ParserResolver };
  validators?: { [name: string]: ValidatorResolver };
  handlers?: { [name: string]: HandlerResolver };
  props?: PropRecipe[];
}

/**
 * Schema property recipe.
 */
export interface PropRecipe {
  set?: string;
  get?: string;
  parse?: ParserRecipe;
  defaultValue?: string;
  fakeValue?: string;
  emptyValue?: string;
  validate?: ValidatorRecipe[];
  handle?: HandlerRecipe[];
  populatable?: string[];
  serializable?: string[];
  enumerable?: boolean;
}

/**
 * Property parser recipe.
 */
export interface ParserRecipe {
  array?: boolean;
  resolver: string;
}

/**
 * Validation recipe interface.
 */
export interface ValidatorRecipe {
  code: number;
  resolver: string;
}

/**
 * Validation recipe interface.
 */
export interface ValidatorRecipe {
  code: number;
  resolver: string;
}

/**
 * Handler recipe interface.
 */
export interface HandlerRecipe {
  code: number;
  resolver: string;
}
