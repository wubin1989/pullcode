import { OpenEnumType } from "./OpenEnumType";
import { OpenProperty } from "./OpenProperty";
import * as ejs from 'ejs';
import { OpenAPI3Schema } from "src/types/openapi";
import * as _ from 'lodash';
import { OpenEnum } from "./OpenEnum";

export class OpenType {

  public name: string | undefined;
  public doc: string | undefined;
  public properties: OpenProperty[] | undefined;
  public enumTypes: OpenEnumType[] | undefined;

  public toCode(): string {
    return ejs.render(`{
      <%_ properties.forEach(function(property){ -%>
        <%_ property.docs.forEach(function(doc){ -%>
          <%_ if(doc){ -%>
    // <%- doc %>
          <%_ } -%>
        <%_ }) -%>
    <%- property.name %><% if(!property.required){ %>?<% } %>: <%- property.type %>;
      <%_ }) -%>
  }`, { properties: this.properties })
  }

  public static fromSchema({ schema, createEnum = false, typeName = '' }: {
    schema: OpenAPI3Schema;
    createEnum?: boolean;
    typeName?: string;
  }): OpenType {
    const openType = new OpenType();
    openType.name = typeName;
    openType.doc = schema.description && schema.description.trim();
    const openProperties = [] as OpenProperty[];
    const openEnumTypes = [] as OpenEnumType[];
    const required = schema.required;
    for (let prop in schema.properties) {
      const openProperty = new OpenProperty();
      openProperty.docs = [];
      openProperty.name = prop;
      const value = schema.properties[prop] as OpenAPI3Schema;
      const desc = value.description && value.description.trim();
      if (desc) {
        openProperty.doc = desc;
        openProperty.docs.push(desc);
      }
      if (value.enum?.length && createEnum) {
        const type = openType.name + _.upperFirst(prop) + "Enum";
        openProperty.type = type;
        const voEnumList: OpenEnum[] = value.enum.map(item => new OpenEnum(_.toUpper(item), item));
        openEnumTypes.push(new OpenEnumType(voEnumList, type));
      } else {
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