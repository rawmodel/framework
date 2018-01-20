import { Validator, ValidatorRecipe } from 'validatable';
import { Handler, HandlerRecipe } from 'handleable';
import { Model } from './models';
export interface FieldRecipe {
    type?: any;
    get?: (v: any) => any;
    set?: (v: any) => void;
    defaultValue?: any;
    fakeValue?: any;
    nullValue?: any;
    validate?: ValidatorRecipe[];
    handle?: HandlerRecipe[];
    validators?: {
        [name: string]: (v?: any, r?: ValidatorRecipe) => boolean | Promise<boolean>;
    };
    handlers?: {
        [name: string]: (v?: any, r?: HandlerRecipe) => boolean | Promise<boolean>;
    };
    owner?: Model;
    failFast?: boolean;
    populatable?: string[];
    serializable?: string[];
    enumerable?: boolean;
}
export interface FieldError {
    message?: string;
    code?: number;
    [key: string]: any;
}
export declare class Field {
    protected _data: any;
    protected _initialData: any;
    protected _validator: Validator;
    protected _handler: Handler;
    protected _recipe: FieldRecipe;
    readonly defaultValue: any;
    readonly fakeValue: any;
    readonly nullValue: any;
    readonly initialValue: any;
    readonly populatable: string[];
    readonly serializable: string[];
    readonly enumerable: boolean;
    readonly owner: Model;
    readonly type: any;
    value: any;
    errors: FieldError[];
    constructor(recipe?: FieldRecipe);
    protected _createValidator(): Validator;
    protected _createHandler(): Handler;
    protected _getValue(): any;
    protected _setValue(data: any): void;
    protected _getDefaultValue(): any;
    protected _getFakeValue(): any;
    protected _getNullValue(): any;
    cast(data: any): any;
    reset(): this;
    fake(): this;
    clear(): this;
    commit(): this;
    rollback(): this;
    equals(data: any): boolean;
    isChanged(): boolean;
    isNested(): boolean;
    validate(): Promise<this>;
    handle(error: any): Promise<this>;
    invalidate(): this;
    hasErrors(): boolean;
    isValid(): boolean;
}
