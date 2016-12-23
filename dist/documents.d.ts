import { Field, FieldRecipe } from './fields';
export interface FieldRef {
    path: string[];
    field: Field;
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
    _getRootDocument(): Document;
    defineField(name: string, recipe?: FieldRecipe): void;
    getPath(...keys: any[]): Field;
    hasPath(...keys: any[]): boolean;
    populate(data?: {}): this;
    serialize(): {};
    flatten(prefix?: string[]): FieldRef[];
    collect(handler: (field: FieldRef) => any): any[];
    scroll(handler: (field: FieldRef) => void): number;
}
