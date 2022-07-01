"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BizServiceGenerator = void 0;
const ejs = require("ejs");
const version_1 = require("../version");
const path = require("path");
const fs = require("fs");
class BizServiceGenerator {
    constructor() {
        this.outputDir = '';
    }
    generate() {
        let out = path.join(this.outputDir, BizServiceGenerator.filename);
        if (!path.isAbsolute(out)) {
            out = path.resolve(process.cwd(), out);
        }
        if (fs.existsSync(out)) {
            console.log(`file ${out} exists, skip`);
            return;
        }
        ejs.renderFile(path.resolve(__dirname, BizServiceGenerator.template), {
            version: version_1.version,
        }, {}, function (err, str) {
            if (err) {
                throw err;
            }
            fs.writeFile(out, str, function (err) {
                if (err) {
                    throw err;
                }
                console.log(`file ${out} is generated`);
            });
        });
    }
}
exports.BizServiceGenerator = BizServiceGenerator;
BizServiceGenerator.filename = 'BizService.ts';
BizServiceGenerator.template = 'BizService.ts.ejs';
//# sourceMappingURL=BizServiceGenerator.js.map