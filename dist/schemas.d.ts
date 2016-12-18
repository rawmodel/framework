export declare class Schema {
    fields: {};
    strict: boolean;
    validators: {};
    types: {};
    firstErrorOnly?: boolean;
    constructor({mixins, fields, strict, validators, types, firstErrorOnly}?: {
        mixins?: Schema[];
        fields?: {};
        strict?: boolean;
        validators?: {};
        types?: {};
        firstErrorOnly?: boolean;
    });
}
