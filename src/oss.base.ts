import { createHmac } from 'crypto';
import { OSSOptions } from './oss.provider';
import * as stream from 'stream';
import * as moment from 'moment';
import * as Path from 'path';
import * as OSS from 'ali-oss';

export interface UploadResult {
    uploaded: boolean;
    path: string;
    src: string;
    srcSign: string;
    message: string
}

export interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

export interface OSSSucessResponse {
    name: string,
    url?: string,
    res: OSS.NormalSuccessResponse,
    size?: number,
    aborted?: boolean,
    rt?: number,
    keepAliveSocket?: boolean,
    data?: Buffer,
    requestUrls?: string[]
    timing?: null,
    remoteAddress?: string,
    remotePort?: number,
    socketHandledRequests?: number,
    socketHandledResponses?: number
}

export interface ClientSign {
    name?: string;
    key?: string;
    policy: string;
    OSSAccessKeyId: string;
    success_action_status?: number;
    signature: string;
}

export interface UploadFileOptions {
    filepath?: string;
    filename?: string;
    isInitDateDic?: boolean;
    dateDicFormat?: string;
}

export class OSSBase {
    protected ossClient: OSS;
    protected options: OSSOptions;
    protected version = parseFloat(process.versions.node);

    /**
     * 流式上传
     * @param target 
     * @param imageStream 
     */
    protected async putStream(target: string, imageStream: stream.PassThrough): Promise<OSSSucessResponse> {
        return await this.ossClient.putStream(target, imageStream);
    }

    /**
     * 上传到OSS
     * @param file 
     */
    protected async uploadOSS(file: File|File[], options?: UploadFileOptions) {
        const result: UploadResult[] = [];
        const files = Array.isArray(file) ? file : [file]

        if (files && files.length > 0) {
            for (const item of files) {
                const filename = options?.filename
                    ? options?.filename + Path.extname(item.originalname).toLowerCase()
                    : this.getImgName(item.originalname);

                const filepath = this.parseFilepath(options?.filepath);
                const path = `${filepath}/${this.initDateDic(options?.isInitDateDic, options?.dateDicFormat)}`;
                const target = path + filename;

                const info: UploadResult = {
                    uploaded: true, 
                    path: '',
                    src: '',
                    srcSign: '',
                    message: '上传成功'
                };

                try {
                    const imageStream = new stream.PassThrough();
                    imageStream.end(item.buffer);
                    const uploadResult = await this.putStream(target, imageStream);
                    
                    if (uploadResult.res.status === 200) {
                        info.path = uploadResult.name
                        info.src = this.formatDomain(uploadResult.url);
                        info.srcSign = this.getOssSign(info.src);
                    }
                } catch (error) {
                    console.error('error', error);
                    info.uploaded = false;
                    info.path = item.originalname;
                    info.message = `上传失败: ${error}`;
                }

                result.push(info);
            }
        }

        return result;
    }

    /** 格式化自定义域名 */
    private formatDomain(url?: string) {
        if (!url) return '';

        const domain = this.options.domain;
        if (!domain) return url;

        const { bucket, endpoint } = this.options.client;
        return url.replace(`${bucket}.${endpoint}`, domain);
    }

    /**
     * 生成文件名(按时间)
     * @param {*} filename 
     */
    protected getImgName(filename: string) {
        const time = moment().format('HHmmss');
        const randomStamp = `${Math.floor(Math.random() * 1000)}`;
        const extname = Path.extname(filename).toLowerCase();

        return time + randomStamp + extname;
    }

    /**
     * 转化为可用路径格式
     * @param filepath 自定义上传oss文件路径
     */
    private parseFilepath(filepath?: string) {
        if (!filepath) return 'image';
        if (filepath.lastIndexOf('/') === filepath.length - 1)  {
            return filepath.substring(0, filepath.length - 1)
        };
        return filepath;
    }

    /**
     * 自定义初始化文件夹
     * @param isInitDateDic 是否自动按照日期创建文件夹
     * @param format 自定义格式（与momentjs format一致）
     */
    private initDateDic(isInitDateDic?: boolean, format?: string) {
        let isInit = false
        if (typeof isInitDateDic === 'undefined') isInit = true;
        else isInit = isInitDateDic;

        if (!isInit) return ''
        return !format ? moment().format('YYYYMMDD') + '/' : moment().format(format) + '/'
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
            const isSelfUrlX: string = this.options.domain || '';

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
            const h = this.options.client.secure ? 'https' : 'http';
            
            if (width && height) {
                urlReturn = `${h}://${endpoint}/${target}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0&OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
            } else {
                urlReturn = `${h}://${endpoint}/${target}?OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
            }
        }

        return urlReturn;
    }

    /**
     * 前端直传签名
     */
    public getUploadSgin() {
        const policyText = {
            'expiration': `${moment().add(1, 'hours').format('YYYY-MM-DDTHH:mm:ss')}.000Z`, // 设置Policy的失效时间
            'conditions': [
                ['content-length-range', 0, 50048576000] // 设置上传文件的大小限制
            ]
        };
        const policyBase64 = Buffer.from((JSON.stringify(policyText))).toString('base64');
        const uploadSignature = createHmac('sha1', this.options.client.accessKeySecret).update(policyBase64).digest('base64');

        const params: ClientSign = {
            policy: policyBase64,
            OSSAccessKeyId: this.options.client.accessKeyId,
            signature: uploadSignature
        }

        return params;
    }
}
