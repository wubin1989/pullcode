"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenRoute = void 0;
const OpenProperty_1 = require("./OpenProperty");
const OpenTypeConstants_1 = require("./OpenTypeConstants");
const _ = require("lodash");
class OpenRoute {
    constructor() {
        this.respData = new OpenProperty_1.OpenProperty(OpenTypeConstants_1.OpenTypeConstants.ANY);
        this.hasHeaders = false;
    }
    static of(endpoint, httpMethod, operation, components) {
        const openRoute = new OpenRoute();
        openRoute.endpoint = endpoint;
        openRoute.httpMethod = httpMethod;
        const strings = [];
        if (operation.summary) {
            strings.push(...operation.summary.split(/[^\S ]/));
        }
        if (operation.description) {
            strings.push(...operation.description.split(/[^\S ]/));
        }
        openRoute.docs = strings;
        if (operation["x-method-name"]) {
            openRoute.name = operation["x-method-name"];
        }
        else {
            openRoute.setName();
        }
        let requestBody = operation.requestBody;
        if (requestBody) {
            if (requestBody.$ref) {
                const key = requestBody.$ref.replace("#/components/requestBodies/", '');
                requestBody = components.requestBodies && components.requestBodies[key];
                if (!requestBody) {
                    throw new Error(`missing ${key} definition`);
                }
            }
            requestBody = requestBody;
            const content = requestBody.content;
            const openProperty = new OpenProperty_1.OpenProperty();
            openProperty.doc = requestBody.description || '';
            if (content) {
                if (content["application/json"]) {
                    const mediaType = content["application/json"];
                    if (mediaType.schema) {
                        openProperty.name = "payload";
                        openProperty.in = "requestBody";
                        openProperty.setTypeSchema(mediaType.schema);
                        openRoute.reqBody = openProperty;
                    }
                }
                else if (content["application/octet-stream"]) {
                    const mediaType = content["application/octet-stream"];
                    if (mediaType.schema) {
                        openProperty.name = 'formData';
                        openProperty.in = 'requestBody';
                        openProperty.type = OpenTypeConstants_1.OpenTypeConstants.FORMDATA;
                        openRoute.reqBody = openProperty;
                    }
                }
                else if (content["multipart/form-data"]) {
                    const formData = content["multipart/form-data"];
                    if (formData.schema) {
                        openProperty.name = 'formData';
                        openProperty.in = 'requestBody';
                        openProperty.type = OpenTypeConstants_1.OpenTypeConstants.FORMDATA;
                        openRoute.reqBody = openProperty;
                    }
                }
                else if (content["application/x-www-form-urlencoded"]) {
                    const formUrlencoded = content["application/x-www-form-urlencoded"];
                    if (formUrlencoded.schema) {
                        let formUrlencodedSchema = formUrlencoded.schema;
                        if (formUrlencodedSchema.$ref) {
                            const key = formUrlencodedSchema.$ref.replace("#/components/schemas/", '');
                            if (!components.schemas || !components.schemas[key]) {
                                throw new Error(`missing ${key} definition`);
                            }
                            formUrlencodedSchema = components.schemas && components.schemas[key];
                        }
                        formUrlencodedSchema = formUrlencodedSchema;
                        const required = formUrlencodedSchema.required;
                        const properties = formUrlencodedSchema.properties;
                        const urlSearchParams = properties && Object.keys(properties).map(propName => {
                            const property = new OpenProperty_1.OpenProperty();
                            const propSchema = properties[propName];
                            property.doc = propSchema.description;
                            property.in = 'requestBody';
                            property.name = propName;
                            property.setTypeSchema(propSchema);
                            property.required = _.includes(required, propName);
                            return property;
                        });
                        openRoute.urlSearchParams = urlSearchParams;
                    }
                }
                else if (content["text/plain"]) {
                    const mediaType = content["text/plain"];
                    if (mediaType.schema) {
                        openProperty.name = 'payload';
                        openProperty.in = 'requestBody';
                        openProperty.setTypeSchema(mediaType.schema);
                        openRoute.reqBody = openProperty;
                    }
                }
                else if (content["*/*"]) {
                    const mediaType = content["*/*"];
                    if (mediaType.schema) {
                        openProperty.name = 'payload';
                        openProperty.in = 'requestBody';
                        openProperty.setTypeSchema(mediaType.schema);
                        openRoute.reqBody = openProperty;
                    }
                }
            }
        }
        const openProperties = operation.parameters && operation.parameters.map((para) => {
            para = para;
            const openProperty = new OpenProperty_1.OpenProperty();
            openProperty.in = para.in;
            openProperty.name = para.name;
            openProperty.setTypeSchema(para.schema);
            openProperty.required = !!para.required;
            openProperty.doc = para.description;
            return openProperty;
        });
        if (openProperties && openProperties.length) {
            const pathParams = [];
            const queryParams = [];
            const headerParams = [];
            for (let i = 0; i < openProperties.length; i++) {
                const openProperty = openProperties[i];
                if (openProperty.in === "path") {
                    pathParams.push(openProperty);
                }
                else if (openProperty.in === "query") {
                    queryParams.push(openProperty);
                }
                else if (openProperty.in === "header") {
                    headerParams.push(openProperty);
                }
            }
            openRoute.pathParams = pathParams;
            openRoute.queryParams = queryParams;
            openRoute.headerParams = headerParams;
            openRoute.allParams = openProperties;
        }
        if (openRoute.urlSearchParams && openRoute.urlSearchParams.length) {
            if (!openRoute.allParams) {
                openRoute.allParams = [];
            }
            openRoute.allParams.push(...openRoute.urlSearchParams);
            if (!openRoute.defaultHeaders) {
                openRoute.defaultHeaders = {};
            }
            openRoute.defaultHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if ((openRoute.headerParams && openRoute.headerParams.length) || openRoute.defaultHeaders) {
            openRoute.hasHeaders = true;
        }
        const responses = operation.responses;
        if (responses) {
            let okResponse = responses['200'];
            if (okResponse) {
                if (okResponse.$ref) {
                    const key = okResponse.$ref.replace("#/components/responses/", '');
                    if (!components.responses || !components.responses[key]) {
                        throw new Error(`missing ${key} definition`);
                    }
                    okResponse = components.responses && components.responses[key];
                }
                okResponse = okResponse;
                const content = okResponse.content;
                if (content) {
                    const mediaType = content["application/json"] || content["*/*"] || content["application/octet-stream"] || content["text/plain"];
                    if (mediaType) {
                        const openProperty = new OpenProperty_1.OpenProperty();
                        openProperty.name = 'data';
                        openProperty.in = 'responseBody';
                        openProperty.setTypeSchema(mediaType.schema);
                        openProperty.doc = okResponse.description;
                        openRoute.respData = openProperty;
                    }
                }
            }
        }
        return openRoute;
    }
    setName() {
        if (!this.endpoint || !this.httpMethod) {
            return;
        }
        let endpoint = _.lowerCase(this.endpoint.replace(/[^a-zA-Z0-9]/g, "_"));
        endpoint = _.upperFirst(_.camelCase(endpoint));
        this.name = _.lowerCase(this.httpMethod) + endpoint;
    }
}
exports.OpenRoute = OpenRoute;
//# sourceMappingURL=OpenRoute.js.map