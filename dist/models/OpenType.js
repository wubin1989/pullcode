"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenType = void 0;
const OpenEnumType_1 = require("./OpenEnumType");
const OpenProperty_1 = require("./OpenProperty");
const ejs = require("ejs");
const _ = require("lodash");
const OpenEnum_1 = require("./OpenEnum");
class OpenType {
    toCode() {
        return ejs.render(`{
      <%_ properties.forEach(function(property){ -%>
        <%_ property.docs.forEach(function(doc){ -%>
          <%_ if(doc){ -%>
    // <%- doc %>
          <%_ } -%>
        <%_ }) -%>
    <%- property.name %><% if(!property.required){ %>?<% } %>: <%- property.type %>;
      <%_ }) -%>
  }`, { properties: this.properties });
    }
    static fromSchema({ schema, createEnum = false, typeName = '' }) {
        var _a;
        const openType = new OpenType();
        openType.name = typeName;
        openType.doc = schema.description && schema.description.trim();
        const openProperties = [];
        const openEnumTypes = [];
        const required = schema.required;
        for (let prop in schema.properties) {
            const openProperty = new OpenProperty_1.OpenProperty();
            openProperty.docs = [];
            openProperty.name = prop;
            const value = schema.properties[prop];
            const desc = value.description && value.description.trim();
            if (desc) {
                openProperty.doc = desc;
                openProperty.docs.push(desc);
            }
            if (((_a = value.enum) === null || _a === void 0 ? void 0 : _a.length) && createEnum) {
                const type = openType.name + _.upperFirst(prop) + "Enum";
                openProperty.type = type;
                const voEnumList = value.enum.map(item => new OpenEnum_1.OpenEnum(_.toUpper(item), item));
                openEnumTypes.push(new OpenEnumType_1.OpenEnumType(voEnumList, type));
            }
            else {
                openProperty.setTypeSchema(value);
            }
            if (required && required.length) {
                openProperty.required = _.includes(required, prop);
            }
            openProperties.push(openProperty);
        }
        openType.properties = openProperties;
        openType.enumTypes = openEnumTypes;
        return openType;
    }
}
exports.OpenType = OpenType;
//# sourceMappingURL=OpenType.js.map