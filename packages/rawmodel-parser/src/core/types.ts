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
}

/**
 * Custom parser handler function.
 */
export type CustomParserHandler = ((v: any) => any);

/**
 * Parser config.
 */
export type ParserConfig = PrimitiveParserConfig | ArrayParserConfig | CustomParserConfig;

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
  parse?: ParserConfig;
}

/**
 * Custom parser interface.
 */
export interface CustomParserConfig {
  kind: ParserKind.CUSTOM;
  handler: CustomParserHandler;
}
