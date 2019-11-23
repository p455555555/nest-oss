/// <reference types="node" />
import * as stream from 'stream';
import { OSSOptions } from './oss.provider';
import * as OSS from 'ali-oss';
export interface UploadResult {
    uploaded: boolean;
    path: string;
    src: string;
    srcSign: string;
    message: string;
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
    name: string;
    url?: string;
    res: OSS.NormalSuccessResponse;
    size?: number;
    aborted?: boolean;
    rt?: number;
    keepAliveSocket?: boolean;
    data?: Buffer;
    requestUrls?: string[];
    timing?: null;
    remoteAddress?: string;
    remotePort?: number;
    socketHandledRequests?: number;
    socketHandledResponses?: number;
}
export interface ClientSign {
    name?: string;
    key?: string;
    policy: string;
    OSSAccessKeyId: string;
    success_action_status?: number;
    signature: string;
}
export declare class OSSBase {
    protected ossClient: OSS;
    protected options: OSSOptions;
    protected version: number;
    /**
     * 流式上传
     * @param target
     * @param imageStream
     */
    protected putStream(target: string, imageStream: stream.PassThrough): Promise<OSSSucessResponse>;
    /**
     * 上传到OSS
     * @param file
     */
    protected uploadOSS(file: File | File[]): Promise<UploadResult[]>;
    /**
     * 生成文件名(按时间)
     * @param {*} filename
     */
    protected getImgName(filename: string): string;
    /**
     * 获取私密bucket访问地址
     * @param {*} url
     * @param {*} width
     * @param {*} height
     */
    getOssSign(url: string, width?: number, height?: number): string;
    /**
     * 前端直传签名
     */
    getUploadSgin(): ClientSign;
}
