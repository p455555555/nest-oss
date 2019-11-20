import { NormalSuccessResponse, DeleteMultiResult } from 'ali-oss';
import { OSSOptions } from './oss.provider';
import { OSSBase, UploadResult, File } from './oss.base';
import * as OSS from 'ali-oss';
/**
 * OSS
 * @export
 * @class OSSService
 */
export declare class OSSService extends OSSBase {
    protected readonly ossClient: OSS;
    protected readonly options: OSSOptions;
    constructor(ossClient: OSS, options: OSSOptions);
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
    deleteMulti(targets: string[]): Promise<DeleteMultiResult>;
    /**
     * 上传
     * @param file
     */
    upload(files: File[]): Promise<UploadResult[]>;
    /**
     * 上传到OSS(多线程并行上传)
     * @param file
     */
    private uploadOSSMuit;
    /**
     * 结束上传进程(仅作为单元测试结束调用)
     */
    endThread(): void;
}
