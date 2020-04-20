
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { TestModule } from './test.module';
import { TestController } from './test.controller';

interface File {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	buffer: Buffer;
    size: number;
}

class File {
    public fieldname: string;
    public buffer: Buffer;
    public size: number;
    public originalname: string;

    constructor(name: string, content: Buffer) {
        this.fieldname = 'files';
        this.originalname = name;
        this.encoding = '7bit';
        this.mimetype = 'image/jpeg';
        this.buffer = content;
        this.size = this.buffer.length;
    }
}

describe('TestController', () => {
    let testController: TestController;
    const fileName = 'nodejs-1024x768.png';
    const uploadUrl: string[] = [];

    beforeAll(async () => {
        const app: TestingModule  = await Test.createTestingModule({
            controllers: [TestController],
            imports: [TestModule],
        }).compile();

        testController = app.get<TestController>(TestController);
    });

    it('流式上传测试', async () => {
        const fileBuf = fs.readFileSync(`${__dirname}/${fileName}`);
        const webFile: File = new File(fileName, fileBuf);
        const result = await testController.uploadOSS(webFile, { filepath: '/upload' });

        for (const item of result) {
            uploadUrl.push(item.path);
            expect(item.uploaded).toBe(true);
        }
    });

    it('删除图片测试', async () => {
        const result = await testController.deleteMulti(uploadUrl);

        expect(result.res.status).toBe(200);
    });

    it('获取前端直传参数测试', () => {
        const result = testController.getUploadSgin();

        // console.log('签名参数输出>>', result);
        expect(result.policy.length).toBe(128);
        expect(result.OSSAccessKeyId.length).toBe(24);
        expect(result.signature.length).toBe(28);
    });

    afterAll(() => {
        // testController.endThread();
        process.exitCode = 0;
    });
});
