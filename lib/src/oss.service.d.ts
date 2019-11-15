import { NormalSuccessResponse, DeleteMultiResult } from 'ali-oss';
import { OSSOptions } from './oss.provider';
import * as OSS from 'ali-oss';
interface uploadResult {
    uploaded: boolean;
    path: string;
    src: string;
    srcSign: string;
    message: string;
}
/**
 * OSS
 * @export
 * @class OSSService
 */
export declare class OSSService {
    private readonly ossClient;
    private readonly options;
    constructor(ossClient: OSS, options: OSSOptions);
    /**
     * 流式上传
     * @param target
     * @param imageStream
     */
    putStream(target: string, imageStream: any): Promise<any>;
    /**
     * 流式下载
     * @param target
     */
    getStream(target: string): Promise<OSS.GetStreamResult>;
    /**
     * 删除
     * @param target
     */
    delete(target: string): Promise<NormalSuccessResponse>;
    /**
     * 批量删除
     * @param target
     */
    deleteMulti(targets: Array<string>): Promise<DeleteMultiResult>;
    /**
     * 生成文件名(按时间)
     * @param {*} filename
     */
    private getImgName;
    /**
     * 上传到OSS
     * @param file
     */
    uploadOSS(file: any): Promise<uploadResult[]>;
    /**
     * 获取私密bucket访问地址
     * @param {*} url
     * @param {*} width
     * @param {*} height
     */
    getOssSign(url: string, width?: number, height?: number): string;
}
export {};
