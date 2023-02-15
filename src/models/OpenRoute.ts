import { OpenProperty } from "./OpenProperty";
import { OpenTypeConstants } from "./OpenTypeConstants";
import { OpenAPIV3 } from "openapi-types";
import { OpenAPI3Operation, OpenAPI3Schema } from "src/types/openapi";
import * as _ from 'lodash';

export class OpenRoute {

  public name: string | undefined;
  public endpoint: string | undefined;
  public httpMethod: string | undefined;
  public reqBody: OpenProperty | undefined;
  public respData: OpenProperty = new OpenProperty(OpenTypeConstants.ANY);
  public pathParams: OpenProperty[] | undefined;
  public queryParams: OpenProperty[] | undefined;
  public urlSearchParams: OpenProperty[] | undefined;
  public allParams: OpenProperty[] | undefined;
  public headerParams: OpenProperty[] | undefined;
  public defaultHeaders: { [key: string]: string } | undefined;
  public hasHeaders: boolean = false;
  public docs: string[] | undefined;

  public static of(endpoint: string, httpMethod: string, operation: OpenAPI3Operation, components: OpenAPIV3.ComponentsObject): OpenRoute {
    const openRoute = new OpenRoute();
    openRoute.endpoint = endpoint;
    openRoute.httpMethod = httpMethod;
    const strings: string[] = [];
    if (operation.summary) {
      strings.push(...operation.summary.split(/[^\S ]/));
    }
    if (operation.description?.trim()) {
      strings.push(...operation.description.trim().split(/[^\S ]/));
    }
    openRoute.docs = strings;
    if (operation["x-method-name"]) {
      openRoute.name = operation["x-method-name"];
    } else {
      openRoute.setName();
    }
    let requestBody = operation.requestBody;
    if (requestBody) {
      if ((requestBody as OpenAPIV3.ReferenceObject).$ref) {
        const key = (requestBody as OpenAPIV3.ReferenceObject).$ref.replace("#/components/requestBodies/", '');
        requestBody = components.requestBodies?.[key];
        if (!requestBody) {
          throw new Error(`missing ${key} definition`)
        }
      }
      requestBody = requestBody as OpenAPIV3.RequestBodyObject
      const content = requestBody.content;
      const openProperty = new OpenProperty();
      openProperty.doc = requestBody.description?.trim();
      if (content) {
        if (content["application/json"]) {
          const mediaType = content["application/json"];
          if (mediaType.schema) {
            openProperty.name = "payload";
            openProperty.in = "requestBody";
            openProperty.setTypeSchema(mediaType.schema as OpenAPI3Schema);
            openRoute.reqBody = openProperty;
          }
        } else if (content["application/octet-stream"]) {
          const mediaType = content["application/octet-stream"];
          if (mediaType.schema) {
            openProperty.name = 'formData';
            openProperty.in = 'requestBody';
            openProperty.type = OpenTypeConstants.FORMDATA;
            openRoute.reqBody = openProperty;
          }
        } else if (content["multipart/form-data"]) {
          const formData = content["multipart/form-data"];
          if (formData.schema) {
            openProperty.name = 'formData';
            openProperty.in = 'requestBody';
            openProperty.type = OpenTypeConstants.FORMDATA;
            openRoute.reqBody = openProperty;
          }
        } else if (content["application/x-www-form-urlencoded"]) {
          const formUrlencoded = content["application/x-www-form-urlencoded"];
          if (formUrlencoded.schema) {
            let formUrlencodedSchema = formUrlencoded.schema;
            if ((formUrlencodedSchema as OpenAPIV3.ReferenceObject).$ref) {
              const key = (formUrlencodedSchema as OpenAPIV3.ReferenceObject).$ref.replace("#/components/schemas/", '');
              if (!components.schemas || !components.schemas[key]) {
                throw new Error(`missing ${key} definition`)
              }
              formUrlencodedSchema = components.schemas[key]
            }
            formUrlencodedSchema = formUrlencodedSchema as OpenAPIV3.SchemaObject
            const required = formUrlencodedSchema.required;
            const properties = formUrlencodedSchema.properties;
            const urlSearchParams = properties && Object.keys(properties).map(propName => {
              const property = new OpenProperty();
              const propSchema = properties[propName] as OpenAPI3Schema;
              property.doc = propSchema.description?.trim();
              property.in = 'requestBody';
              property.name = propName.replace('[]', '');
              property.setTypeSchema(propSchema)
              property.required = _.includes(required, propName);
              return property;
            })
            openRoute.urlSearchParams = urlSearchParams;
          }
        } else if (content["text/plain"]) {
          const mediaType = content["text/plain"];
          if (mediaType.schema) {
            openProperty.name = 'payload';
            openProperty.in = 'requestBody';
            openProperty.setTypeSchema(mediaType.schema as OpenAPI3Schema);
            openRoute.reqBody = openProperty;
          }
        } else if (content["*/*"]) {
          const mediaType = content["*/*"];
          if (mediaType.schema) {
            openProperty.name = 'payload';
            openProperty.in = 'requestBody'
            openProperty.setTypeSchema(mediaType.schema as OpenAPI3Schema);
            openRoute.reqBody = openProperty;
          }
        }
      }
    }

    const openProperties = operation.parameters?.map((para) => {
      para = para as OpenAPIV3.ParameterObject
      const openProperty = new OpenProperty();
      openProperty.in = para.in;
      openProperty.name = para.name.replace('[]', '');
      openProperty.setTypeSchema(para.schema as OpenAPI3Schema);
      openProperty.required = !!para.required;
      openProperty.doc = para.description?.trim();
      return openProperty;
    });
    if (openProperties?.length) {
      const pathParams = [] as OpenProperty[];
      const queryParams = [] as OpenProperty[];
      const headerParams = [] as OpenProperty[];
      for (let i = 0; i < openProperties.length; i++) {
        const openProperty = openProperties[i];
        if (openProperty.in === "path") {
          pathParams.push(openProperty);
        } else if (openProperty.in === "query") {
          queryParams.push(openProperty);
        } else if (openProperty.in === "header") {
          headerParams.push(openProperty);
        }
      }
      openRoute.pathParams = pathParams;
      openRoute.queryParams = queryParams;
      openRoute.headerParams = headerParams;
      openRoute.allParams = openProperties;
    }

    if (openRoute.urlSearchParams?.length) {
      if (!openRoute.allParams) {
        openRoute.allParams = [];
      }
      openRoute.allParams.push(...openRoute.urlSearchParams);
      if (!openRoute.defaultHeaders) {
        openRoute.defaultHeaders = {};
      }
      openRoute.defaultHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (openRoute.headerParams?.length || openRoute.defaultHeaders) {
      openRoute.hasHeaders = true;
    }
    const responses = operation.responses;
    if (responses) {
      let okResponse = responses['200'];
      if (okResponse) {
        if ((okResponse as OpenAPIV3.ReferenceObject).$ref) {
          const key = (okResponse as OpenAPIV3.ReferenceObject).$ref.replace("#/components/responses/", '');
          if (!components.responses || !components.responses[key]) {
            throw new Error(`missing ${key} definition`);
          }
          okResponse = components.responses[key];
        }
        okResponse = okResponse as OpenAPIV3.ResponseObject
        const content = okResponse.content;
        if (content) {
          const mediaType = content["application/json"] || content["*/*"] || content["application/octet-stream"] || content["text/plain"];
          if (mediaType) {
            const openProperty = new OpenProperty();
            openProperty.name = 'data';
            openProperty.in = 'responseBody';
            openProperty.setTypeSchema(mediaType.schema as OpenAPI3Schema);
            openProperty.doc = okResponse.description?.trim();
            openRoute.respData = openProperty;
          }
        }
      }
    }
    return openRoute;
  }

  private setName() {
    if (!this.endpoint || !this.httpMethod) {
      return;
    }
    let endpoint = _.lowerCase(this.endpoint.replace(/[^a-zA-Z0-9]/g, "_"));
    endpoint = _.upperFirst(_.camelCase(endpoint));
    this.name = _.lowerCase(this.httpMethod) + endpoint;
  }

}