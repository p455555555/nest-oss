import { Injectable, Inject } from '@nestjs/common';
import { NormalSuccessResponse, DeleteMultiResult } from 'ali-oss';
import { OSS_CONST, OSS_OPTIONS, OSSOptions } from './oss.provider';
import { createHmac } from 'crypto';
import * as OSS from 'ali-oss';
import * as moment from 'moment';
import * as stream from 'stream';
import * as path from 'path';

interface uploadResult {
    uploaded: boolean;
    path: string;
    src: string;
    srcSign: string;
    message: string
}

/**
 * OSS
 * @export
 * @class OSSService
 */
@Injectable()
export class OSSService {

    constructor(
        @Inject(OSS_CONST) private readonly ossClient: OSS,
        @Inject(OSS_OPTIONS) private readonly options: OSSOptions
    ) {}

    /**
     * 流式上传
     * @param target 
     * @param imageStream 
     */
    public async putStream(target: string, imageStream: any): Promise<any> {

        return await this.ossClient.putStream(target, imageStream);
    }

    /**
     * 流式下载
     * @param target 
     */
    public async getStream(target: string): Promise<OSS.GetStreamResult>{

        return await this.ossClient.getStream(target);
    }

    /**
     * 删除
     * @param target 
     */
    public async delete(target: string): Promise<NormalSuccessResponse> {

        return await this.ossClient.delete(target);
    }

    /**
     * 批量删除
     * @param target 
     */
    public async deleteMulti(targets: Array<string>): Promise<DeleteMultiResult> {

        return await this.ossClient.deleteMulti(targets);
    }

    /**
     * 生成文件名(按时间)
     * @param {*} filename 
     */
    private getImgName(filename: string): string {
        const name = `${moment().format('HHmmss')}${Math.floor(Math.random() * 100)}${path.extname(filename).toLowerCase()}`;

        return name;
    }


    /**
     * 上传到OSS
     * @param file 
     */
    public async uploadOSS(file: any): Promise<uploadResult[]>{
        const result = [];

        if (file && file.length > 0) {
			for (const item of file) {
                const filename: string = this.getImgName(item.originalname);
                const imgPath: string = `images/${moment().format('YYYYMMDD')}`;
                const target = imgPath + '/' + filename;
                const info: uploadResult = {
                    uploaded: true, 
                    path: '',
                    src: '',
                    srcSign: '',
                    message: '上传成功'
                };

                try {
                    const imageStream: any = new stream.PassThrough();
                    imageStream.end(item.buffer);
                    const uploadResult = await this.putStream(target, imageStream);
                    
                    if (uploadResult.res.status === 200) {
                        info.path = uploadResult.name
                        info.src = uploadResult.url;
                        info.srcSign = this.getOssSign(uploadResult.url);
                    }
                } catch (error) {
                    console.error('error', error);
                    info.uploaded = false;
                    info.message = '上传失败';
                }

                result.push(info);
			}
        }

        return result;
    }

    /**
     * 获取私密bucket访问地址
     * @param {*} url
     * @param {*} width
     * @param {*} height
     */
    public getOssSign(url: string, width?: number, height?: number) {
        let target = url;
        // 拼装签名后访问地址
        let urlReturn = '';
        
        if (url) { 
            const isSelfUrl = `${this.options.client.bucket}.${this.options.client.endpoint}`;
            const isSelfUrlX: string = this.options.domain;

            // 判断是否包含有效地址
            if (url.indexOf(isSelfUrl) > 0 || url.indexOf(isSelfUrlX) > 0) {
                let targetArray: string[] = [];
                if (url.indexOf('?') > 0) {
                    targetArray = url.split('?');
                    target = targetArray[0];
                }
                targetArray = target.split('com/');
                target = targetArray[1];
            } else {
                return url;
            }
            // 读取配置初始化参数
            const accessId = this.options.client.accessKeyId;
            const accessKey = this.options.client.accessKeySecret;
            let endpoint = `${this.options.client.bucket}.${this.options.client.endpoint}`;
            const signDateTime = parseInt(moment().format('X'), 10);
            const outTime = 2 * 3600; // 失效时间
            const expireTime = signDateTime + outTime;

            if (this.options.domain) {
                endpoint = this.options.domain;
            }

            // 拼装签名字符串
            let toSignString = '';
            toSignString = 'GET\n';
            const md5 = '';
            toSignString = `${toSignString}${md5}\n`;
            const contentType = '';
            toSignString = `${toSignString}${contentType}\n`;
            toSignString = `${toSignString}${expireTime}\n`;
            let resource = '';

            if (width && height) {
                resource = `/${this.options.client.bucket}/${target}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0`;
            } else {
                resource = `/${this.options.client.bucket}/${target}`;
            }

            const ossHeaders = '';
            toSignString = toSignString + ossHeaders;
            toSignString = toSignString + resource;

            // hmacsha1 签名
            const sign = encodeURIComponent(createHmac('sha1', accessKey).update(toSignString).digest('base64'));
            
            if (width && height) {
                urlReturn = `https://${endpoint}/${target}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0&OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
            } else {
                urlReturn = `https://${endpoint}/${target}?OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
            }
        }

        return urlReturn;
    }
}
