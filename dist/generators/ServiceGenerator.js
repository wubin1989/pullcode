"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceGenerator = void 0;
const ejs = __importStar(require("ejs"));
const version_1 = require("../version");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const _ = __importStar(require("lodash"));
const prettier = __importStar(require("prettier"));
class ServiceGenerator {
    constructor() {
        this.outputDir = '';
    }
    generate() {
        if (!this.service) {
            return;
        }
        const name = _.upperFirst(this.service.name);
        let out = path.join(this.outputDir, name + ".ts");
        if (!path.isAbsolute(out)) {
            out = path.resolve(process.cwd(), out);
        }
        if (fs.existsSync(out)) {
            console.log(`file ${out} will be overwritten...`);
        }
        const module = _.upperFirst(this.service.module);
        ejs.renderFile(path.resolve(__dirname, ServiceGenerator.template), {
            version: version_1.version,
            types: this.service.types,
            name,
            module,
            routes: this.service.routes,
            _,
        }, {}, function (err, str) {
            if (err) {
                throw err;
            }
            fs.writeFile(out, prettier.format(str, { parser: "typescript" }), function (err) {
                if (err) {
                    throw err;
                }
                console.log(`file ${out} is generated`);
            });
        });
    }
}
exports.ServiceGenerator = ServiceGenerator;
ServiceGenerator.template = 'Service.ts.ejs';
//# sourceMappingURL=ServiceGenerator.js.map