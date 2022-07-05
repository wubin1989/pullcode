"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenProperty = void 0;
const OpenTypeConstants_1 = require("./OpenTypeConstants");
const OpenType_1 = require("./OpenType");
class OpenProperty {
    constructor(type = '') {
        this.required = true;
        this.type = type;
    }
    getTypeByRef(ref) {
        const key = ref.substring(ref.lastIndexOf('/') + 1);
        if (!key) {
            return OpenTypeConstants_1.OpenTypeConstants.ANY;
        }
        return key.replace(/[^a-zA-Z0-9_]/g, "");
    }
    setTypeSchema(schema) {
        this.type = this.deepSetType(schema);
    }
    setTypeString(type) {
        this.type = type;
    }
    deepSetType(schema) {
        var _a;
        let type = schema.type;
        if (!type) {
            return this.getTypeByRef(schema.$ref);
        }
        let tsType = '';
        switch (type) {
            case "boolean": {
                tsType = OpenTypeConstants_1.OpenTypeConstants.BOOLEAN;
                break;
            }
            case "integer": {
                tsType = OpenTypeConstants_1.OpenTypeConstants.NUMBER;
                break;
            }
            case "number": {
                tsType = OpenTypeConstants_1.OpenTypeConstants.NUMBER;
                break;
            }
            case "string": {
                if (schema.format === "binary") {
                    tsType = OpenTypeConstants_1.OpenTypeConstants.BLOB;
                }
                else if ((_a = schema.enum) === null || _a === void 0 ? void 0 : _a.length) {
                    tsType = schema.enum.map(item => `'${item}'`).join(" | ");
                }
                else {
                    tsType = OpenTypeConstants_1.OpenTypeConstants.STRING;
                }
                break;
            }
            case "array": {
                const items = schema.items;
                if (items.$ref) {
                    tsType = this.getTypeByRef(items.$ref);
                }
                else if (items.type) {
                    tsType = this.deepSetType(items);
                }
                else {
                    tsType = "";
                }
                tsType += "[]";
                break;
            }
            case "object": {
                if (schema["x-title"]) {
                    tsType = schema["x-title"].replace(/[^a-zA-Z0-9_]/g, "");
                }
                else if (Object.keys(schema.properties || {}).length) {
                    tsType = OpenType_1.OpenType.fromSchema({
                        schema: schema,
                    }).toCode();
                }
                else {
                    tsType = OpenTypeConstants_1.OpenTypeConstants.ANY;
                }
                break;
            }
            default: {
                tsType = OpenTypeConstants_1.OpenTypeConstants.ANY;
            }
        }
        return tsType;
    }
}
exports.OpenProperty = OpenProperty;
//# sourceMappingURL=OpenProperty.js.map