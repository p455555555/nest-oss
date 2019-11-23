[![npm version](https://badge.fury.io/js/%40nest-public%2Fnest-oss.svg)](https://badge.fury.io/js/%40nest-public%2Fnest-oss)

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
		endpoint: 'oss-cn-shenzhen.aliyuncs.com', // endpoint域名
		accessKeyId: 'xxxxxxxxxxxx', // 账号
		accessKeySecret: 'xxxxxxx', // 密码
		bucket: 'xxxxxx', // 存储桶
		internal: false, // 是否使用阿里云内部网访问
		secure: true, // 使用 HTTPS
		cname: false, // 自定义endpoint
		timeout: '90s'
	},
	domain: '', // 自定义域名
	multi: true, // 是否开启多线程迸发上传（需node.js 11.7.0以上版本, 默认关闭）
	workers: 4 // 开启线程数，默认为CPU线程数的一半
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
import { OSSService } from '@nest-public/nest-oss';

/**
 * AppController
 * @export
 * @class AppControllerr
 */
@Controller()
export class AppController {
    constructor(private readonly oSSService: OSSService) {}

   /**
    * 多文件上传oss
    */
    @Post('uploadOSS')
    @UseInterceptors(FilesInterceptor('files'))
	public async uploadOSS(@UploadedFiles() file) {
		const result = await this.oSSService.upload(file);

		return result;
		// result [
		// 	{
		// 		uploaded: true,
		// 		path: 'images/20191115/16420962.png',
		// 		src: 'http://xxxx.oss-cn-shenzhen.aliyuncs.com/images/20191115/16420962.png',
		// 		srcSign: 'https://xxx.oss-cn-shenzhen.aliyuncs.com/images/20191115/16420962.png?OSSAccessKeyId=LTAI6lgwcBcCbiKX&Expires=1573814530&Signature=brYN7qbDdyxGARc%2BdoRsnblJx2w%3D',
		// 		message: '上传成功'
		// 	}
		// ]
    }
    
    /**
     * 对oss文件签名
     */
    @Get('getUrl')
    public async uploadOSS(@Req() request) {
        const url = req.query.url; // 原始oss url
        const width = req.query.width; // 设置返回图片宽度
        const height = req.query.height; // 设置返回图片高度
        const result = await this.oSSService.getOssSign(file, width, height);

        return result;
	}
	
	/**
	 * 前端获取签名
	 */
	@Get('uploadSgin')
	public getUploadSgin() {
		const result = this.oSSService.getUploadSgin();

		return result;

        // result {
		// 	policy: 'xxxxxxxxxxxxxx';
		// 	OSSAccessKeyId: 'xxxxxxxxxxxxxx'
		// 	signature: 'xxxxxxxxxxxxxx'
		// }
	}

    /**
     * 批量删除图片
     */
    @Get('getUrl')
    public async uploadOSS(@Req() request) {
        const uploadUrl = ['images/20191115/16420962.png'];
		const result = await this.oSSService.deleteMulti([uploadUrl]);

		return result;
		// result {
		// 	res: {
		// 		status: 200,
		// 		statusCode: 200,
		// 		statusMessage: 'OK',
		// 		// ....
		// 	},
		//  deleted: [ 'images/20191115/16420962.png' ]
		// }
    }
}
```

## 获取签名参数在浏览器端上传说明
可以参考 https://help.aliyun.com/document_detail/31925.html?spm=a2c4g.11186623.2.11.10836e28CWrMt0#concept-frd-4gy-5db

 1. 通过接口获取签名参数
 2. 以fromdata的形式准备好上传数据（一次只能上传一个文件）
```javascript
// 上传参数
const params = new FromData();
formData.append('key', '${filename}');
formData.append('name', '${filename}'); // 文件名
formData.append('policy', 'xxxxxx');
formData.append('OSSAccessKeyId', 'xxxxxx');
formData.append('success_action_status', 200); // 让服务端返回200，不设置则默认返回204
formData.append('signature', 'xxxxxx');
formData.append('file', file); // 上传的文件 
```
 3. 以 Post multipart 形式上传

## 测试
进行单元测试前请先配置好 test.module.ts 里面的oss配置
```bash
# jest 测试
$ npm run test
```
