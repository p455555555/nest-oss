import { DynamicModule } from '@nestjs/common';
import { OSSOptions } from './oss.provider';
/**
 * oss方法实例化模块
 * @export
 * @class BaseModule
 */
export declare class OSSModule {
    static forRoot(options: OSSOptions): DynamicModule;
}
