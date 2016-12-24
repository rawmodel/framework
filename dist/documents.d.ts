import { Field, FieldRecipe, FieldError } from './fields';
export interface FieldRef {
    path: string[];
    field: Field;
}
export interface FieldErrorRef extends Error {
    path: string[];
    errors: FieldError[];
}
export interface DocumentOptions {
    parent?: Document;
}
export declare class Document {
    protected _fields: {
        [name: string]: Field;
    };
    readonly options: DocumentOptions;
    readonly parent: Document;
    constructor(data?: any, options?: DocumentOptions);
    protected _getRootDocument(): Document;
    protected _createField(recipe?: FieldRecipe): Field;
    protected _createValidationError(message?: string, code?: number): FieldError;
    protected _createDocument(data?: any, options?: DocumentOptions): any;
    defineField(name: string, recipe?: FieldRecipe): void;
    getPath(...keys: any[]): Field;
    hasPath(...keys: any[]): boolean;
    populate(data?: {}): this;
    serialize(): {};
    flatten(prefix?: string[]): FieldRef[];
    collect(handler: (field: FieldRef) => any): any[];
    scroll(handler: (field: FieldRef) => void): number;
    filter(test: (field: FieldRef) => boolean): {};
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
    collectErrors(): FieldErrorRef[];
    applyErrors(errors?: FieldErrorRef[]): this;
    hasErrors(): boolean;
    isValid(): boolean;
    invalidate(): this;
    clone(): this;
}
