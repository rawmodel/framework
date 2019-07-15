import { Model } from '@rawmodel/core';
import { isUndefined, isFunction } from '@rawmodel/utils';
import { SchemaRecipe } from './types';

/**
 * Returns a Model class generated from the provided schema recipe.
 * @param recipe Model schema recipe.
 */
export function createModel(recipe: SchemaRecipe): typeof Model {
  recipe = {
    context: {},
    getters: {},
    setters: {},
    defaultValues: {},
    fakeValues: {},
    emptyValues: {},
    parsers: {},
    validators: {},
    handlers: {},
    props: [],
    ...recipe,
  };

  const Klass = class GenericModel extends Model {};

  Object.defineProperty(Klass, '$props', {
    value: {},
    enumerable: false,
    configurable: true,
  });

  (recipe.props || []).forEach((prop) => {
    const obj: any = {
      set: recipe.setters[prop.set],
      get: recipe.setters[prop.get],
      populatable: prop.populatable,
      serializable: prop.serializable,
      enumerable: prop.enumerable,
    };

    if (!isUndefined(prop.defaultValue)) {
      obj.defaultValue = isUndefined(recipe.defaultValues[prop.defaultValue])
        ? prop.defaultValue
        : recipe.defaultValues[prop.defaultValue];
    }
    if (!isUndefined(prop.fakeValue)) {
      obj.fakeValue = isUndefined(recipe.fakeValues[prop.fakeValue])
        ? prop.fakeValue
        : recipe.fakeValues[prop.fakeValue];
    }
    if (!isUndefined(prop.emptyValue)) {
      obj.emptyValue = isUndefined(recipe.emptyValues[prop.emptyValue])
        ? prop.emptyValue
        : recipe.emptyValues[prop.emptyValue];
    }

    if (!isUndefined(prop.parse)) {
      if (prop.parse.resolver && !isFunction(recipe.parsers[prop.parse.resolver])) {
        obj.parse = {
          array: !!prop.parse.array,
          resolver: recipe.parsers[prop.parse.resolver],
        };
      }
      else {
        obj.parse = {
          array: !!prop.parse.array,
        };
      }
    }

    (prop.validate || []).forEach((validator) => {
      // TODO
    });

    (prop.handle || []).forEach((handler) => {
      // TODO
    });

    Klass.$props[prop.name] = obj;
  });

  return Klass;
}
