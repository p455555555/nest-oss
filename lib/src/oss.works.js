"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const os_1 = require("os");
const oss_base_1 = require("./oss.base");
const OSS = require("ali-oss");
class Threadpool extends oss_base_1.OSSBase {
    constructor() {
        super();
        this.workPool = new Map();
        this.workNum = Math.floor(os_1.cpus().length / 2);
        if (!worker_threads_1.isMainThread && this.version >= 11.7) {
            this.workerThread();
        }
    }
    /**
     * 创建线程池
     * @param options
     */
    mainThread(options) {
        this.workNum = options.workers || this.workNum;
        for (let i = 0; i < this.workNum; i++) {
            const worker = new worker_threads_1.Worker(__filename, { workerData: options });
            this.workPool.set(`worker${i}`, worker);
        }
    }
    /**
     * 工作线程
     */
    workerThread() {
        this.ossClient = new OSS(worker_threads_1.workerData.client);
        this.options = worker_threads_1.workerData;
        // console.log(`[nest-oss]:worker started with threadId:${threadId}`);
        if (worker_threads_1.parentPort) {
            worker_threads_1.parentPort.on('message', async (msg) => {
                if (typeof msg !== 'string') {
                    const result = await this.uploadOSS(msg);
                    if (worker_threads_1.parentPort) {
                        worker_threads_1.parentPort.postMessage(result);
                    }
                }
                else if (typeof msg === 'string' && msg === 'endThread') {
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
    sendData(data) {
        const fileLength = data.length;
        const splicData = new Array(this.workNum);
        for (let i = 0; i < fileLength; i++) {
            if (i < this.workNum) {
                splicData[i] = [];
                splicData[i].push(data[i]);
            }
            else {
                splicData[i % this.workNum].push(data[i]);
            }
        }
        return new Promise((resolve) => {
            const result = [];
            for (let i = 0; i < this.workNum; i++) {
                const item = splicData[i];
                const worker = this.workPool.get(`worker${i}`);
                if (worker && item) {
                    worker.postMessage(item);
                    worker.once('message', (msg) => {
                        result.push(...msg);
                        if (result.length === fileLength) {
                            resolve(result);
                        }
                    });
                }
                else {
                    break;
                }
            }
        });
    }
    /**
     * 结束工作线程
     */
    endThread() {
        for (let i = 0; i < this.workNum; i++) {
            const worker = this.workPool.get(`worker${i}`);
            if (worker) {
                worker.postMessage('endThread');
            }
        }
    }
}
exports.threadpool = new Threadpool();
//# sourceMappingURL=oss.works.js.map