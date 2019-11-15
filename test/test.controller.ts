import { Controller, Get, Post } from '@nestjs/common';
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

	/**
	 * 批量删除
	 */
	@Get('delete')
	public async deleteMulti(file) {
		const result = await this.oss.deleteMulti(file);

		return result;
	}
}
