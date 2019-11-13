import { Controller, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { OSS } from '../src/oss.service';

/**
 * test
 * @export
 * @class testController
 */
@Controller()
export class TestController {
	constructor(private readonly oss: OSS) {}

	/**
	 * 多文件上传oss
	 */
	@Post('uploadOSS')
	public async uploadOSS(file) {
		const result = await this.oss.uploadOSS(file);

		return result;
	}
}
