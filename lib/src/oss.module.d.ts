import { DynamicModule } from '@nestjs/common';
import { OSSOptions } from './oss.provider';
export declare class OSSModule {
    static forRoot(options: OSSOptions): DynamicModule;
}
