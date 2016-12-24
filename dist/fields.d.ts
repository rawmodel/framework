import { Validator, ValidatorRecipe } from 'validatable';
import { Document } from './documents';
export interface FieldOptions {
    owner?: Document;
    validators?: {
        [name: string]: (v?, r?: ValidatorRecipe) => boolean | Promise<boolean>;
    };
    failFast?: boolean;
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
    name?: string;
    code?: number;
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
    protected _createValidator(): Validator;
    protected _getValue(): any;
    protected _setValue(data: any): void;
    protected _cast(data: any, type: any): any;
    protected _getDefaultValue(): any;
    protected _getFakeValue(): any;
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
