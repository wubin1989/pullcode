import { OpenTypeConstants } from "./OpenTypeConstants";
import type { OpenAPI3Schema } from '../types/openapi';
import { OpenType } from "./OpenType";

export class OpenProperty {
  public name: string | undefined;
  public type: string | undefined;
  public in: string | undefined;
  public required: boolean = true;
  public doc: string | undefined;
  public docs: string[] | undefined;

  constructor(type = '') {
    this.type = type;
  }

  private getTypeByRef(ref: string) {
    const key: string = ref.substring(ref.lastIndexOf('/') + 1)
    if (!key) {
      return OpenTypeConstants.ANY;
    }
    return key.replace(/[^a-zA-Z0-9_]/g, "")
  }

  public setTypeSchema(schema: OpenAPI3Schema) {
    this.type = this.deepSetType(schema);
  }

  public setTypeString(type: string) {
    this.type = type;
  }

  private deepSetType(schema: OpenAPI3Schema): string {
    let type = schema.type;
    if (!type) {
      return this.getTypeByRef(schema.$ref)
    }
    let tsType = '';
    switch (type) {
      case "boolean": {
        tsType = OpenTypeConstants.BOOLEAN;
        break;
      }
      case "integer": {
        tsType = OpenTypeConstants.NUMBER;
        break;
      }
      case "number": {
        tsType = OpenTypeConstants.NUMBER;
        break;
      }
      case "string": {
        const format = schema.format;
        if (format === "binary") {
          tsType = OpenTypeConstants.BLOB;
        } else {
          tsType = OpenTypeConstants.STRING;
        }
        break;
      }
      case "array": {
        const items = schema.items;
        if (items.$ref) {
          tsType = this.getTypeByRef(items.$ref);
        } else if (items.type) {
          tsType = this.deepSetType(items);
        } else {
          tsType = "";
        }
        tsType += "[]";
        break;
      }
      case "object": {
        if (schema["x-title"]) {
          tsType = schema["x-title"].replace(/[^a-zA-Z0-9_]/g, "");
        } else if (Object.keys(schema.properties || {}).length) {
          tsType = OpenType.fromSchema({
            schema: schema,
            enumAs: 'DOC',
          }).toCode();
        } else {
          tsType = OpenTypeConstants.ANY;
        }
        break;
      }
      default: {
        tsType = OpenTypeConstants.ANY;
      }
    }
    return tsType;
  }

}