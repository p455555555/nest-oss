
import { Module, Global, DynamicModule } from '@nestjs/common';
import { OSS_OPTIONS, OSSOptions, ossProvider } from './oss.provider';
import { OSS } from './oss.service';

/**
 * oss方法实例化模块
 * @export
 * @class BaseModule
 */
@Global()
@Module({
	imports: [],
	providers: [OSS],
	exports: [OSS]
})

export class OSSModule {
    public static forRoot(options: OSSOptions): DynamicModule {

        return {
            module: OSSModule,
            providers: [
                ossProvider(),
                { provide: OSS_OPTIONS, useValue: options }
            ],
            exports: [OSS]
        };
    }
}
