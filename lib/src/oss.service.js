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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const oss_provider_1 = require("./oss.provider");
const crypto_1 = require("crypto");
const moment = require("moment");
const stream = require("stream");
const path = require("path");
let OSS = class OSS {
    constructor(ossClient, options) {
        this.ossClient = ossClient;
        this.options = options;
        this.oss = this.ossClient;
        this.config = this.options;
    }
    putStream(target, imageStream) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.oss.putStream(target, imageStream);
        });
    }
    getStream(target) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.oss.getStream(target);
        });
    }
    delete(target) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.oss.delete(target);
        });
    }
    deleteMulti(targets) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.oss.deleteMulti(targets);
        });
    }
    getImgName(filename) {
        const name = `${moment().format('HHmmss')}${Math.floor(Math.random() * 100)}${path.extname(filename).toLowerCase()}`;
        return name;
    }
    uploadOSS(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            if (file && file.length > 0) {
                for (const item of file) {
                    const filename = this.getImgName(item.originalname);
                    const imgPath = `images/${moment().format('YYYYMMDD')}`;
                    const target = imgPath + '/' + filename;
                    const info = {
                        uploaded: true,
                        src: '',
                        message: '上传成功'
                    };
                    try {
                        const imageStream = new stream.PassThrough();
                        imageStream.end(item.buffer);
                        const uploadResult = yield this.putStream(target, imageStream);
                        if (uploadResult.res.status === 200) {
                            info.src = this.getOssSign(uploadResult.url);
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
        });
    }
    getOssSign(url, width, height) {
        let target = url;
        if (url) {
            const isSelfUrl = `${this.config.client.bucket}.${this.config.client.endpoint}`;
            const isSelfUrlX = this.config.domain;
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
            const accessId = this.config.client.accessKeyId;
            const accessKey = this.config.client.accessKeySecret;
            let endpoint = `${this.config.client.bucket}.${this.config.client.endpoint}`;
            const signDateTime = parseInt(moment().format('X'), 10);
            const outTime = 2 * 3600;
            const expireTime = signDateTime + outTime;
            if (this.config.domain) {
                endpoint = this.config.domain;
            }
            let toSignString = '';
            toSignString = 'GET\n';
            const md5 = '';
            toSignString = `${toSignString}${md5}\n`;
            const contentType = '';
            toSignString = `${toSignString}${contentType}\n`;
            toSignString = `${toSignString}${expireTime}\n`;
            let resource = '';
            if (width && height) {
                resource = `/${this.config.client.bucket}/${target}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0`;
            }
            else {
                resource = `/${this.config.client.bucket}/${target}`;
            }
            const ossHeaders = '';
            toSignString = toSignString + ossHeaders;
            toSignString = toSignString + resource;
            const sign = encodeURIComponent(crypto_1.createHmac('sha1', accessKey).update(toSignString).digest('base64'));
            let urlReturn = '';
            if (width && height) {
                urlReturn = `https://${endpoint}/${target}?x-oss-process=image/resize,m_fill,w_${width},h_${height},limit_0&OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
            }
            else {
                urlReturn = `https://${endpoint}/${target}?OSSAccessKeyId=${accessId}&Expires=${expireTime}&Signature=${sign}`;
            }
            return urlReturn;
        }
    }
};
OSS = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(oss_provider_1.OSS_CONST)),
    __param(1, common_1.Inject(oss_provider_1.OSS_OPTIONS)),
    __metadata("design:paramtypes", [Object, Object])
], OSS);
exports.OSS = OSS;
//# sourceMappingURL=oss.service.js.map