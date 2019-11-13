import * as OSS from 'ali-oss';
export declare const OSS_CONST: unique symbol;
export declare const OSS_OPTIONS: unique symbol;
export interface OSSOptions {
    client: OSS.Options;
    domain: string;
}
export declare const ossProvider: () => {
    provide: symbol;
    useFactory: (options: OSSOptions) => OSS;
    inject: symbol[];
};
