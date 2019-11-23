import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { OSSModule } from '../src/oss.module';

// oss配置，可以写在专门的配置文件里面
const options = {
	client: {
		endpoint: 'oss-cn-shenzhen.aliyuncs.com',
		accessKeyId: 'xxxxxxxxxxxx',
		accessKeySecret: 'xxxxxxx',
		bucket: 'xxxxxx',
		internal: false, // 是否使用阿里云内部网访问
		secure: true, // 使用 HTTPS
		cname: false, // 自定义endpoint
		timeout: '90s'
	},
	multi: false,
	workers: 4
};
/**
 * test模块
 * @class AppModule
 */
@Module({
	imports: [ 
		OSSModule.forRoot(options)
	],
	controllers: [TestController],
})

export class TestModule{}
