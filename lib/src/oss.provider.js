"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OSS = require("ali-oss");
exports.OSS_CONST = Symbol('OSS');
exports.OSS_OPTIONS = Symbol('OSS_OPTIONS');
exports.ossProvider = () => ({
    provide: exports.OSS_CONST,
    useFactory: (options) => {
        return new OSS(options.client);
    },
    inject: [exports.OSS_OPTIONS]
});
//# sourceMappingURL=oss.provider.js.map