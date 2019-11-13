"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OSSModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const oss_provider_1 = require("./oss.provider");
const oss_service_1 = require("./oss.service");
let OSSModule = OSSModule_1 = class OSSModule {
    static forRoot(options) {
        return {
            module: OSSModule_1,
            providers: [
                oss_provider_1.ossProvider(),
                { provide: oss_provider_1.OSS_OPTIONS, useValue: options }
            ],
            exports: [oss_service_1.OSS]
        };
    }
};
OSSModule = OSSModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({
        imports: [],
        providers: [oss_service_1.OSS],
        exports: [oss_service_1.OSS]
    })
], OSSModule);
exports.OSSModule = OSSModule;
//# sourceMappingURL=oss.module.js.map