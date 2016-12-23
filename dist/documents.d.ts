import { FieldRecipe } from './fields';
export declare class Document {
    private _fields;
    constructor();
    defineField(name: string, recipe?: FieldRecipe): void;
}
