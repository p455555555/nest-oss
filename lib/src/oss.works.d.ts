import { OSSOptions } from './oss.provider';
import { OSSBase, UploadResult, File } from './oss.base';
declare class Threadpool extends OSSBase {
    private workPool;
    workNum: number;
    constructor();
    /**
     * 创建线程池
     * @param options
     */
    mainThread(options: OSSOptions): void;
    /**
     * 工作线程
     */
    workerThread(): void;
    /**
     * 向工作线程发送任务
     * @param data
     */
    sendData(data: File[]): Promise<UploadResult[]>;
    /**
     * 结束工作线程
     */
    endThread(): void;
}
export declare const threadpool: Threadpool;
export {};
