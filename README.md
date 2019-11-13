[![npm version](https://badge.fury.io/js/%40nest-public%2Ftotp.svg)](https://badge.fury.io/js/%40nest-public%2Ftotp)

# nest-oss

[Nest](https://github.com/nestjs/nest)框架 阿里云OSS上传插件

## 安装

```bash
$ npm install @nest-public/nest-oss --save
```

## 用法
config.js 配置
```javascript
export const config = {
	client: {
		endpoint: 'oss-cn-shenzhen.aliyuncs.com', // 域名
		accessKeyId: 'xxxxxxxxxxxx', // 账号
		accessKeySecret: 'xxxxxxx', // 密码
		bucket: 'xxxxxx', // 桶
		internal: false, // 是否使用阿里云内部网访问
		secure: true, // 使用 HTTPS
		cname: false, // 自定义endpoint
		timeout: '90s'
	},
	domain: '' // 自定义域名
};
```
module.ts
```javascript
import { AppController } from './test.controller';
import { OSSModule } from '@nest-public/nest-oss';
import { config } from '../config/config.js';

@Module({
	imports: [ 
		OSSModule.forRoot(config)
	],
	controllers: [AppController],
})

export class AppModule{}

```
controller.ts
```javascript
import { Controller, Req, Post, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { OSS } from '@nest-public/nest-oss';

/**
 * test
 * @export
 * @class testController
 */
@Controller()
export class AppController {
	constructor(private readonly oss: OSS) {}

	/**
	 * 多文件上传oss
	 */
    @Post('uploadOSS')
    @UseInterceptors(FilesInterceptor('files'))
	public async uploadOSS(@UploadedFiles() file) {
		const result = await this.oss.uploadOSS(file);

		return result;
    }
    
    /**
	 * 对oss文件签名
	 */
    @Get('getUrl')
	public async uploadOSS(@Req() request) {
        const url = req.query.url; // 原始oss url
        const width = req.query.width; // 设置返回图片宽度
        const height = req.query.height; // 设置返回图片高度
		const result = await this.oss.getOssSign(file, width, height);

		return result;
	}
}
```

## 测试
进行单元测试前请先配置好 test.module.ts 里面的oss配置
```bash
# jest 测试
$ npm run test
```
