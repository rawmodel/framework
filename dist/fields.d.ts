import { Validator } from 'validatable';
import { Document } from './documents';
export interface FieldOptions {
    owner?: Document;
    validators?: {
        [name: string]: () => boolean | Promise<boolean>;
    };
    firstErrorOnly?: boolean;
}
export interface ValidationRecipe {
    validator: string;
    message: string;
    [key: string]: any;
}
export interface FieldRecipe {
    type?: any;
    get?: (v: any) => any;
    set?: (v: any) => void;
    defaultValue?: any;
    fakeValue?: any;
    validate?: ValidationRecipe[];
}
export interface FieldError {
    message: string;
    [key: string]: any;
}
export declare class Field {
    protected _data: any;
    protected _initialData: any;
    protected _validator: Validator;
    readonly recipe: FieldRecipe;
    readonly options: FieldOptions;
    readonly defaultValue: any;
    readonly fakeValue: any;
    readonly initialValue: any;
    readonly owner: Document;
    readonly type: any;
    value: any;
    errors: FieldError[];
    constructor(recipe?: FieldRecipe, options?: FieldOptions);
    _createValidator(): Validator;
    _getValue(): any;
    _setValue(data: any): void;
    _cast(data: any, type: any): any;
    _getDefaultValue(): any;
    _getFakeValue(): any;
    reset(): this;
    fake(): this;
    clear(): this;
    commit(): this;
    rollback(): this;
    equals(data: any): boolean;
    isChanged(): boolean;
    isNested(): boolean;
    validate(): Promise<this>;
    invalidate(): this;
    hasErrors(): boolean;
    isValid(): boolean;
}
