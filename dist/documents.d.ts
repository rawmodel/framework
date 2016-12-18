import { Validator } from 'validatable';
import { Schema } from './schemas';
import { Field } from './fields';
export interface FieldRef {
    path: string[];
    field: Field;
}
export interface FieldError extends Error {
    path: string[];
    errors: any[];
}
export declare class Document {
    $schema: Schema;
    $parent: Document;
    $root: Document;
    $validator: Validator;
    constructor(data: any, schema: Schema, parent?: Document);
    _getRootDocument(): any;
    _createDocument(data?: any, schema?: any, parent?: any): any;
    _createField(name: any): Field;
    _createValidator(): Validator;
    _createValidationError(paths: any): any;
    _defineFields(): void;
    _defineField(name: any): void;
    getPath(...keys: any[]): Field;
    hasPath(...keys: any[]): boolean;
    flatten(prefix?: string[]): FieldRef[];
    populate(data?: {}): this;
    _populateFields(data?: {}): this;
    _populateField(name: any, value: any): void;
    serialize(): {};
    filter(test: (field: FieldRef) => boolean): {};
    collect(handler: (field: FieldRef) => FieldRef): FieldRef[];
    scroll(handler: (field: FieldRef) => void): number;
    reset(): this;
    fake(): this;
    clear(): this;
    commit(): this;
    rollback(): this;
    equals(value: any): boolean;
    clone(): this;
    isChanged(): boolean;
    validate({quiet}?: {
        quiet?: boolean;
    }): Promise<this>;
    invalidate(): this;
    isValid(): boolean;
    isNested(): boolean;
    hasErrors(): boolean;
    collectErrors(): FieldError[];
    applyErrors(errors?: FieldError[]): this;
}
