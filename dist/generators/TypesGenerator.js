"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypesGenerator = void 0;
const ejs = require("ejs");
const version_1 = require("../version");
const path = require("path");
const fs = require("fs");
const prettier = require("prettier");
class TypesGenerator {
    constructor() {
        this.outputDir = '';
    }
    generate() {
        if (!this.types || !this.types.length) {
            return;
        }
        let out = path.join(this.outputDir, "types.ts");
        if (!path.isAbsolute(out)) {
            out = path.resolve(process.cwd(), out);
        }
        if (fs.existsSync(out)) {
            console.log(`file ${out} will be overwritten...`);
        }
        ejs.renderFile(path.resolve(__dirname, TypesGenerator.template), {
            version: version_1.version,
            types: this.types,
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
exports.TypesGenerator = TypesGenerator;
TypesGenerator.template = 'types.ts.ejs';
//# sourceMappingURL=TypesGenerator.js.map