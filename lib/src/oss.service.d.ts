import { NormalSuccessResponse, DeleteMultiResult } from 'ali-oss';
import { OSSOptions } from './oss.provider';
interface uploadResult {
    uploaded: boolean;
    path: string;
    src: string;
    srcSign: string;
    message: string;
}
export declare class OSS {
    private readonly ossClient;
    private readonly options;
    constructor(ossClient: any, options: OSSOptions);
    putStream(target: string, imageStream: any): Promise<any>;
    getStream(target: string): Promise<{
        name: string;
        res: NormalSuccessResponse;
    }>;
    delete(target: string): Promise<NormalSuccessResponse>;
    deleteMulti(targets: Array<string>): Promise<DeleteMultiResult>;
    private getImgName;
    uploadOSS(file: any): Promise<uploadResult[]>;
    getOssSign(url: string, width?: number, height?: number): string;
}
export {};
