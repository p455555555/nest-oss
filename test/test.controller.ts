import { Controller, Get, Post } from '@nestjs/common';
import { OSSService } from '../src/oss.service';

interface File {
	name: string;
    buffer: Buffer;
    size: number;
    originalname: string;
}

/**
 * test
 * @export
 * @class testController
 */
@Controller()
export class TestController {
	constructor(private readonly OSSService: OSSService) {}

	/**
	 * 多文件上传oss
	 */
	@Post('uploadOSS')
	public async uploadOSS(file: File[]) {
		const result = await this.OSSService.uploadOSS(file);

		return result;
	}

	/**
	 * 批量删除
	 */
	@Get('delete')
	public async deleteMulti(file: string[]) {
		const result = await this.OSSService.deleteMulti(file);

		return result;
	}
}
