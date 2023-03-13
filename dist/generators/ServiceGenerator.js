"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceGenerator = void 0;
const ejs = require("ejs");
const version_1 = require("../version");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const prettier = require("prettier");
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