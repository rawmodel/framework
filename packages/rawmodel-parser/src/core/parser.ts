import { isUndefined, isNull, toArray, toString, toBoolean, toInteger, toFloat,
  toNumber, toDate, isFunction, isString } from '@rawmodel/utils';

/**
 * Handler function type.
 */
export type CastHandler = 'String' | 'Boolean' | 'Integer' | 'Float' | 'Number' | 'Date' | ((v: any) => any);

/**
 * Model property type interface.
 */
export interface CastConfig {
  handler?: CastHandler;
  array?: boolean;
}

/**
 * Converts the provided value into desired type.
 * @param value Value or an object.
 * @param handler Cast handler function or type name.
 * @param array Set to `true` to automatically convert to array.
 */
export function cast(value: any, handler: CastHandler, array: boolean) {
  if (isUndefined(value) || isNull(value)) {
    return value;
  }
  else if (array) {
    return toArray(value).map((v) => cast(v, handler, false));
  }
  else if (isFunction(handler)) {
    return (handler as any)(value);
  }
  else if (isString(handler)) {
    return {
      'String': toString,
      'Boolean': toBoolean,
      'Integer': toInteger,
      'Float': toFloat,
      'Number': toNumber,
      'Date': toDate,
    }[handler as string](value);
  }
  else {
    return value;
  }
}
