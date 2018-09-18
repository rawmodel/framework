import * as parser from '@rawmodel/parser';
import { Model } from './models';

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
export type CastHandler = parser.CastHandler;

/**
 * Converts the provided value into desired type.
 * @param value Value or an object.
 * @param handler Cast handler function or type name.
 * @param array Set to `true` to automatically convert to array.
 */
export function cast(value: any, handler: CastHandler, array: boolean) {
  return parser.cast(value, handler, array);
}
