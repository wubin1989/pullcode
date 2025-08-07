import { OpenAPIV3 } from "openapi-types";
export interface OpenAPI3Schema extends OpenAPIV3.BaseSchemaObject, OpenAPIV3.ReferenceObject {
  type: 'boolean' | 'object' | 'number' | 'string' | 'integer' | 'array';
  items: OpenAPI3Schema;
  "x-title": string;
}

export interface OpenAPI3Operation extends OpenAPIV3.OperationObject {
  "x-method-name"?: string;
}