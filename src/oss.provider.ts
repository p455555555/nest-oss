import * as OSS from 'ali-oss';

export const OSS_CONST = Symbol('OSS');
export const OSS_OPTIONS = Symbol('OSS_OPTIONS');

export interface OSSOptions {
    client: OSS.Options
    domain: string
}


export const ossProvider = () => ({
    provide: OSS_CONST,
    useFactory: (options: OSSOptions) => {
		return new OSS(options.client);
    },
    inject: [OSS_OPTIONS]
});
