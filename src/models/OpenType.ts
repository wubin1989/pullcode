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
      <% properties.forEach(function(property){ %>
        <% property.docs.forEach(function(doc){ %>
          <% if(doc){ %>
            // <%- doc %>
          <% } %>
        <% }); %>
        <%- property.name %><% if(!property.required){ %>?<% } %>: <%- property.type %>;
      <% }); %>
    }`, { properties: this.properties })
  }

  public static fromSchema({ schema, enumAs, typeName = '' }: {
    schema: OpenAPI3Schema;
    enumAs?: 'CODE' | 'DOC';
    typeName?: string;
  }): OpenType {
    const openType = new OpenType();
    openType.name = typeName;
    openType.doc = schema.description || '';
    const openProperties = [] as OpenProperty[];
    const openEnumTypes = [] as OpenEnumType[];
    const required = schema.required;
    for (let prop in schema.properties) {
      const openProperty = new OpenProperty();
      openProperty.docs = [];
      openProperty.name = prop;
      const value = schema.properties[prop] as OpenAPI3Schema;
      const desc = (value.description || '').trim()
      if (desc) {
        openProperty.doc = desc;
        openProperty.docs.push(desc);
      }
      if (value.enum && value.enum.length) {
        if (enumAs && enumAs == 'DOC') {
          const enums = value.enum.join(',').trim();
          if (enums) {
            openProperty.doc = openType.doc + "\n" + enums;
            openProperty.docs.push(enums)
          }
          openProperty.setTypeSchema(value);
        } else {
          const type = openType.name + _.upperFirst(prop) + "Enum";
          openProperty.type = type;
          const voEnumList: OpenEnum[] = value.enum.map(item => new OpenEnum(_.upperCase(item), item));
          openEnumTypes.push(new OpenEnumType(voEnumList, type));
        }
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