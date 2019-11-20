import { isMainThread, workerData, parentPort, Worker } from 'worker_threads';
import { cpus } from 'os';
import { OSSOptions } from './oss.provider';
import { OSSBase, UploadResult, File } from './oss.base';
import * as OSS from 'ali-oss';

class Threadpool extends OSSBase {
    private workPool: Map<string, Worker> = new Map();
    public workNum: number;

    constructor() {
        super();
        this.workNum = Math.floor(cpus().length / 2);
        if (!isMainThread && this.version >= 11.7) {
            this.workerThread();
        }
    }

    /**
     * 创建线程池
     * @param options 
     */
    public mainThread(options: OSSOptions) {
        this.workNum = options.workers || this.workNum;
        
        for (let i = 0; i < this.workNum; i++) {
            const worker = new Worker(__filename, { workerData: options });

            this.workPool.set(`worker${i}`, worker);
        }
    }

    /**
     * 工作线程
     */
    public workerThread() {
        this.ossClient = new OSS(workerData.client);
        this.options = workerData;
        // console.log(`[nest-oss]:worker started with threadId:${threadId}`);
        if (parentPort) {
            parentPort.on('message', async (msg: File|File[]|string) => {
                if (typeof msg !== 'string') {
                   const result = await this.uploadOSS(msg);
               
                    if (parentPort) {
                        parentPort.postMessage(result);
                    } 
                } else if (typeof msg === 'string' && msg === 'endThread') {
                    // console.log(`[nest-oss]:Close worker with threadId:${threadId}`);
                    process.exit(0); 
                }
            }); 
        }
    }

    /**
     * 向工作线程发送任务
     * @param data 
     */
    public sendData(data: File[]): Promise<UploadResult[]> {
        const fileLength = data.length;
        const splicData: File[][] = new Array(this.workNum);

        for (let i = 0; i < fileLength; i++) {
            if (i < this.workNum) {
                splicData[i] = [];
                splicData[i].push(data[i]);
            } else {
                splicData[i % this.workNum].push(data[i]);
            }
        }

        return new Promise((resolve) => {
            const result: UploadResult[] = [];
            for (let i = 0; i < this.workNum; i++) {
                const item = splicData[i];
                const worker = this.workPool.get(`worker${i}`);

                if (worker && item) {
                    worker.postMessage(item);
                    worker.once('message', (msg: UploadResult[]) => {
                        result.push(...msg);
                        if (result.length === fileLength) {
                            resolve(result);
                        }
                    });
                } else {
                    break;
                }
            }
        });
    }

    /**
     * 结束工作线程
     */
    public endThread () {
        for (let i = 0; i < this.workNum; i++) {
            const worker = this.workPool.get(`worker${i}`);

            if (worker) {
                worker.postMessage('endThread');
            }
        }
    }
}

export const threadpool = new Threadpool();
