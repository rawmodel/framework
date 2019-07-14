import { isUndefined, isNull, toArray, toString, toBoolean, toInteger, toFloat,
  toDate } from '@rawmodel/utils';
import { ParserConfig, ParserKind } from './types';

/**
 * Converts the provided value into desired type.
 * @param value Value or an object.
 * @param config Parser configuration.
 */
export function parse(value: any, config: ParserConfig) {
  if (isUndefined(value) || isNull(value) || !config || !config.kind) {
    return value;
  }
  switch (config.kind) {
    case ParserKind.ARRAY:
      return toArray(value).map((v) => parse(v, config.parse));
    case ParserKind.CUSTOM:
      return config.handler(value);
    case ParserKind.STRING:
      return toString(value);
    case ParserKind.BOOLEAN:
      return toBoolean(value);
    case ParserKind.INTEGER:
      return toInteger(value);
    case ParserKind.FLOAT:
      return toFloat(value);
    case ParserKind.DATE:
      return toDate(value);
    default:
      return value;
  }
}
