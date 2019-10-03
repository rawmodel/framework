import { HandlerResolver, ParserResolver, SimpleResolver, ValidatorResolver } from '@rawmodel/core';

/**
 * Schema recipe for creating a model.
 */
export interface SchemaRecipe {
  context?: any;
  getters?: { [name: string]: (o?: any) => SimpleResolver };
  setters?: { [name: string]: (o?: any) => SimpleResolver };
  defaultValues?: { [name: string]: (o?: any) => (SimpleResolver | any) };
  fakeValues?: { [name: string]: (o?: any) => (SimpleResolver | any) };
  emptyValues?: { [name: string]: (o?: any) => (SimpleResolver | any) };
  parsers?: { [name: string]: (o?: any) => ParserResolver };
  validators?: { [name: string]: (o?: any) => ValidatorResolver };
  handlers?: { [name: string]: (o?: any) => HandlerResolver };
  props?: PropDefinition[];
}

/**
 * Schema property recipe.
 */
export interface PropDefinition {
  name: string;
  setter?: string;
  getter?: string;
  parser?: ParserRecipe;
  defaultValue?: string;
  fakeValue?: string;
  emptyValue?: string;
  validators?: ValidatorRecipe[];
  handlers?: HandlerRecipe[];
  populatable?: string[];
  serializable?: string[];
  enumerable?: boolean;
}

/**
 * Property parser recipe.
 */
export interface ParserRecipe {
  array?: boolean;
  resolver?: string;
  options?: any;
}

/**
 * Validation recipe interface.
 */
export interface ValidatorRecipe {
  code: number;
  resolver: string;
  options?: any;
}

/**
 * Handler recipe interface.
 */
export interface HandlerRecipe {
  code: number;
  resolver: string;
  options?: any;
}
