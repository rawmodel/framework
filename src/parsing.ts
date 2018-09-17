import { Model, isUndefined, isNull, toArray, toString, toBoolean, toInteger,
  toFloat, toNumber, toDate } from '.';

/**
 * Model property type interface.
 */
export interface CastConfig {
  handler?: CastHandler | (typeof Model);
  array?: boolean;
}

/**
 * Handler function type. 
 */
export type CastHandler = 'String' | 'Boolean' | 'Integer' | 'Float' | 'Number' 
  | 'Date' | ((v: any) => any);

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
  else if (typeof handler === 'function') {
    return handler(value);
  }
  else if (typeof handler === 'string') {
    return {
      'String': toString,
      'Boolean': toBoolean,
      'Integer': toInteger,
      'Float': toFloat,
      'Number': toNumber,
      'Date': toDate,
    }[handler](value);
  }
  else {
    return value;
  }
}
