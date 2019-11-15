"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const oss_provider_1 = require("./oss.provider");
const crypto_1 = require("crypto");
const OSS = require("ali-oss");
const moment = require("moment");
const stream = require("stream");
const path = require("path");
/**
 * OSS
 * @export
 * @class OSSService
 */
let OSSService = class OSSService {
    constructor(ossClient, options) {
        this.ossClient = ossClient;
        this.options = options;
    }
    /**
     * 流式上传
     * @param target
     * @param imageStream
     */
    async putStream(target, imageStream) {
        return await this.ossClient.putStream(target, imageStream);
    }
    /**
     * 流式下载
     * @param target
     */
    async getStream(target) {
        return await this.ossClient.getStream(target);
    }
    /**
     * 删除
     * @param target
     */
    async delete(target) {
        return await this.ossClient.delete(target);
    }
    /**
     * 批量删除
     * @param target
     */
    async deleteMulti(targets) {
        return await this.ossClient.deleteMulti(targets);
    }
    /**
     * 生成文件名(按时间)
     * @param {*} filename
     */
    getImgName(filename) {
        const name = `${moment().format('HHmmss')}${Math.floor(Math.random() * 100)}${path.extname(filename).toLowerCase()}`;
        return name;
    }
    /**
     * 上传到OSS
     * @param file
     */
    async uploadOSS(file) {
        const result = [];
        if (file && file.length > 0) {
            for (const item of file) {
                const filename = this.getImgName(item.originalname);
                const imgPath = `images/${moment().format('YYYYMMDD')}`;
                const target = imgPath + '/' + filename;
                const info = {
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
                        info.path = uploadResult.name;
                        info.src = uploadResult.url;
                        info.srcSign = this.getOssSign(uploadResult.url);
                    }
                }
                catch (error) {
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
    getOssSign(url, width, height) {
        let target = url;
        // 拼装签名后访问地址
        let urlReturn = '';
        if (url) {
            const isSelfUrl = `${this.options.client.bucket}.${this.options.client.endpoint}`;
            const isSelfUrlX = this.options.domain;
            // 判断是否包含有效地址
            if (url.indexOf(isSelfUrl) > 0 || url.indexOf(isSelfUrlX) > 0) {
                let targetArray = [];
                if (url.indexOf('?') > 0) {
                    targetArray = url.split('?');
                    target = targetArray[0];
                }
                targetArray = target.split('com/');
                target = targetArray[1];
            }
            else {
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
            }
            else {
                resource = `/${this.options.client.bucket}/${target}`;
            }
            const ossHeaders = '';
            toSignString = toSignString + ossHeaders;
            toSignString = toSignString + resource;
            // hmacsha1 签名
            const sign = encodeURIComponent(crypto_1.createHmac('sha1', accessKey).update(toSignString).digest('base64'));
            if (width && height) {
                urlReturn = `https://${endpoint}/${target}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0&OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
            }
            else {
                urlReturn = `https://${endpoint}/${target}?OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
            }
        }
        return urlReturn;
    }
};
OSSService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(oss_provider_1.OSS_CONST)),
    __param(1, common_1.Inject(oss_provider_1.OSS_OPTIONS)),
    __metadata("design:paramtypes", [OSS, Object])
], OSSService);
exports.OSSService = OSSService;
//# sourceMappingURL=oss.service.js.map