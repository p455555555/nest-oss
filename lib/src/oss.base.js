"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const stream = require("stream");
const moment = require("moment");
const path = require("path");
class OSSBase {
    constructor() {
        this.version = parseFloat(process.versions.node);
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
     * 上传到OSS
     * @param file
     */
    async uploadOSS(file) {
        const result = [];
        let files = [];
        if (Array.isArray(file)) {
            files = file;
        }
        else {
            files = [file];
        }
        if (files && files.length > 0) {
            for (const item of files) {
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
                        info.src = uploadResult.url || '';
                        info.srcSign = this.getOssSign(info.src);
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
     * 生成文件名(按时间)
     * @param {*} filename
     */
    getImgName(filename) {
        const name = `${moment().format('HHmmss')}${Math.floor(Math.random() * 100)}${path.extname(filename).toLowerCase()}`;
        return name;
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
            const isSelfUrlX = this.options.domain || '';
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
}
exports.OSSBase = OSSBase;
//# sourceMappingURL=oss.base.js.map