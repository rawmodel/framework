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
      parser: {},
      validators: [],
      handlers: [],
    };

    if (!isUndefined(prop.getter) && isFunction(recipe.getters[prop.getter])) {
      obj.getter = recipe.getters[prop.getter]();
    }
    if (!isUndefined(prop.setter) && isFunction(recipe.setters[prop.setter])) {
      obj.setter = recipe.setters[prop.setter]();
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

    if (!isUndefined(prop.parser)) {
      obj.parser.array = !!prop.parser.array;
      if (prop.parser.resolver && isFunction(recipe.parsers[prop.parser.resolver])) {
        obj.parser.resolver = recipe.parsers[prop.parser.resolver](prop.parser.options);
      }
    }

    (prop.validators || []).forEach((validator) => {
      if (isFunction(recipe.validators[validator.resolver])) {
        obj.validators.push({
          ...validator,
          resolver: recipe.validators[validator.resolver](validator.options),
        });
      }
    });

    (prop.handlers || []).forEach((handler) => {
      if (isFunction(recipe.handlers[handler.resolver])) {
        obj.handlers.push({
          ...handler,
          resolver: recipe.handlers[handler.resolver](handler.options),
        });
      }
    });

    Klass.$props[prop.name] = obj;
  });

  return Klass;
}
