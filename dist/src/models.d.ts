import { ValidatorRecipe } from 'validatable';
import { HandlerRecipe } from 'handleable';
import { Field, FieldRecipe, FieldError } from './fields';
export interface FieldRef {
    path: (string | number)[];
    field: Field;
}
export interface FieldErrorRef {
    path: (string | number)[];
    errors: FieldError[];
}
export interface ModelRecipe {
    parent?: Model;
    [key: string]: any;
}
export declare abstract class Model {
    protected _fields: {
        [name: string]: Field;
    };
    protected _types: {
        [key: string]: (v?: any) => any;
    };
    protected _validators: {
        [key: string]: (v?: any, r?: ValidatorRecipe) => boolean | Promise<boolean>;
    };
    protected _handlers: {
        [key: string]: (v?: any, r?: HandlerRecipe) => boolean | Promise<boolean>;
    };
    protected _failFast: boolean;
    readonly root: Model;
    parent: Model;
    constructor(recipe?: ModelRecipe);
    protected _getRootModel(): Model;
    protected _getFieldType(recipe?: FieldRecipe): any;
    protected _createField(recipe?: FieldRecipe): Field;
    protected _createValidationError(message?: string, code?: number): FieldError;
    protected _createModel(recipe?: ModelRecipe): any;
    failFast(fail?: boolean): void;
    defineField(name: string, recipe?: FieldRecipe): void;
    defineType(name: string, converter: (v?: any) => any): void;
    defineValidator(name: string, handler: (v?: any, r?: ValidatorRecipe) => boolean | Promise<boolean>): void;
    defineHandler(name: string, handler: (e?: any, r?: HandlerRecipe) => boolean | Promise<boolean>): void;
    getField(...keys: any[]): Field;
    hasField(...keys: any[]): boolean;
    populate(data?: {}): this;
    serialize(strategy?: string): {
        [key: string]: any;
    };
    flatten(prefix?: string[]): FieldRef[];
    collect(handler: (field: FieldRef) => any): any[];
    scroll(handler: (field: FieldRef) => void): number;
    filter(test: (field: FieldRef) => boolean): {
        [key: string]: any;
    };
    reset(): this;
    fake(): this;
    clear(): this;
    commit(): this;
    rollback(): this;
    equals(value: any): boolean;
    isChanged(): boolean;
    isNested(): boolean;
    validate({quiet}?: {
        quiet?: boolean;
    }): Promise<this>;
    handle(error: any, {quiet}?: {
        quiet?: boolean;
    }): Promise<this>;
    collectErrors(): FieldErrorRef[];
    applyErrors(errors?: FieldErrorRef[]): this;
    hasErrors(): boolean;
    isValid(): boolean;
    invalidate(): this;
    clone(data?: {}): this;
}
