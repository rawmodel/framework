import { Model } from '@rawmodel/core';
import { isUndefined, isFunction } from '@rawmodel/utils';
import { SchemaRecipe } from './types';

/**
 * Returns a Model class generated from the provided schema recipe.
 * @param recipe Model schema recipe.
 */
export function createModelClass(recipe: SchemaRecipe): typeof Model {
  recipe = {
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
      set: undefined,
      get: undefined,
      populatable: prop.populatable,
      serializable: prop.serializable,
      enumerable: prop.enumerable,
      parse: {},
      validate: [],
      handle: [],
    };

    if (!isUndefined(prop.get) && isFunction(recipe.getters[prop.get])) {
      obj.get = recipe.getters[prop.get]();
    }
    if (!isUndefined(prop.set) && isFunction(recipe.setters[prop.set])) {
      obj.set = recipe.setters[prop.set]();
    }

    if (!isUndefined(prop.defaultValue)) {
      obj.defaultValue = isFunction(recipe.defaultValues[prop.defaultValue])
        ? recipe.defaultValues[prop.defaultValue]()
        : prop.defaultValue;
    }
    if (!isUndefined(prop.fakeValue)) {
      obj.fakeValue = isFunction(recipe.fakeValues[prop.fakeValue])
        ? recipe.fakeValues[prop.fakeValue]()
        : prop.fakeValue;
    }
    if (!isUndefined(prop.emptyValue)) {
      obj.emptyValue = isFunction(recipe.emptyValues[prop.emptyValue])
        ? recipe.emptyValues[prop.emptyValue]()
        : prop.emptyValue;
    }

    if (!isUndefined(prop.parse)) {
      obj.parse.array = !!prop.parse.array;
      if (prop.parse.resolver && isFunction(recipe.parsers[prop.parse.resolver])) {
        obj.parse.resolver = recipe.parsers[prop.parse.resolver](prop.parse.options);
      }
    }

    (prop.validate || []).forEach((validator) => {
      if (isFunction(recipe.validators[validator.resolver])) {
        obj.validate.push({
          ...validator,
          resolver: recipe.validators[validator.resolver](validator.options),
        });
      }
    });

    (prop.handle || []).forEach((handler) => {
      if (isFunction(recipe.handlers[handler.resolver])) {
        obj.handle.push({
          ...handler,
          resolver: recipe.handlers[handler.resolver](handler.options),
        });
      }
    });

    Klass.$props[prop.name] = obj;
  });

  return Klass;
}
