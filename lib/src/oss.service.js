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
const oss_base_1 = require("./oss.base");
const OSS = require("ali-oss");
// import { threadpool } from '../lib/src/oss.works.js';
const oss_works_1 = require("./oss.works");
/**
 * OSS
 * @export
 * @class OSSService
 */
let OSSService = class OSSService extends oss_base_1.OSSBase {
    constructor(ossClient, options) {
        super();
        this.ossClient = ossClient;
        this.options = options;
        if (this.version >= 11.7 && this.options.multi) {
            oss_works_1.threadpool.mainThread(this.options);
        }
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
     * 上传
     * @param file
     */
    async upload(files) {
        if (this.version >= 11.7 && this.options.multi) {
            return await this.uploadOSSMuit(files);
        }
        else {
            return await this.uploadOSS(files);
        }
    }
    /**
     * 上传到OSS(多线程并行上传)
     * @param file
     */
    async uploadOSSMuit(files) {
        const result = await oss_works_1.threadpool.sendData(files);
        return result;
    }
    /**
     * 结束上传进程(仅作为单元测试结束调用)
     */
    endThread() {
        oss_works_1.threadpool.endThread();
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