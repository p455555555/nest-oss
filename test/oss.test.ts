
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { TestModule } from './test.module';
import { TestController } from './test.controller';

interface File {
	name: string;
    buffer: Buffer;
    size: number;
    originalname: string;
}
class File {
    public name: string;
    public buffer: Buffer;
    public size: number;
    public originalname: string;

    constructor(name: string, content: Buffer) {
        this.name = name;
        this.originalname = name;
        this.buffer = content;
        this.size = this.buffer.length;
    }
}

describe('TestController', () => {
    let testController: TestController;
    const fileName = 'nodejs-1024x768.png';
    let uploadUrl: string = '';

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
        const result = await testController.uploadOSS([webFile]);

        uploadUrl = result[0].path;

        expect(result[0].uploaded).toBe(true);
    });

    it('删除图片测试', async () => {
        const result = await testController.deleteMulti([uploadUrl]);

        expect(result.res.status).toBe(200);
    });
});
