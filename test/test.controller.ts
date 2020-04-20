import { Controller, Get, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { OSSService } from '../src/oss.service';
import { UploadFileOptions } from '../src/oss.base';

interface File {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	buffer: Buffer;
	size: number;
}

/**
 * test
 * @export
 * @class testController
 */
@Controller()
export class TestController {
	constructor(private readonly oSSService: OSSService) {}

	/**
	 * 多文件上传oss
	 */
	@Post('uploadOSS')
	@UseInterceptors(FilesInterceptor('files'))
	public async uploadOSS(@UploadedFiles() file: File|File[], options?: UploadFileOptions) {
		const result = await this.oSSService.upload(file, options);

		return result;
	}

	/**
	 * 批量删除
	 */
	@Get('delete')
	public async deleteMulti(file: string[]) {
		const result = await this.oSSService.deleteMulti(file);

		return result;
	}

	/**
	 * 前端获取签名
	 */
	@Get('uploadSgin')
	public getUploadSgin() {
		const result = this.oSSService.getUploadSgin();

		return result;
	}

	/**
	 * 测试完毕结束线程
	 */
	// public endThread() {
	// 	this.oSSService.endThread();
	// }
}
