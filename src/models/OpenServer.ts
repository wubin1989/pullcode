import { OpenAPIV3 } from "openapi-types";
import { OpenAPI3Operation, OpenAPI3Schema } from "src/types/openapi";
import { OpenService } from "./OpenService";
import { OpenType } from "./OpenType";
import * as _ from 'lodash';
import { OpenRoute } from "./OpenRoute";
import { OpenTypeConstants } from "./OpenTypeConstants";

class PathItemWrapper {
  public pathItem: OpenAPIV3.PathItemObject | undefined;
  public endpoint: string | undefined;
  public service: string | undefined;
  public module: string | undefined;
}

export class OpenServer {
  public name: string | undefined;
  public services: OpenService[] | undefined;
  public types: OpenType[] | undefined;

  public static getTags(pathItem: OpenAPIV3.PathItemObject): string[] {
    if (pathItem.get) {
      return pathItem.get.tags || []
    }
    if (pathItem.post) {
      return pathItem.post.tags || []
    }
    if (pathItem.put) {
      return pathItem.put.tags || []
    }
    if (pathItem.delete) {
      return pathItem.delete.tags || []
    }
    return [];
  }

  public static convert(document: OpenAPIV3.Document): OpenServer {
    const openServer = new OpenServer();
    const servers = document.servers;
    if (servers && servers.length) {
      openServer.name = servers[0].url
    }
    const types: OpenType[] = [];
    const schemas = document.components && document.components.schemas;
    if (schemas) {
      for (let prop in schemas) {
        types.push(OpenType.fromSchema({
          schema: schemas[prop] as OpenAPI3Schema,
          createEnum: true,
          typeName: prop.replace(/[^a-zA-Z0-9_]/g, ""),
        }))
      }
    }
    openServer.types = types;
    const paths = document.paths;
    const pathItemWrapperMap = new Map<string, PathItemWrapper[]>();
    for (let prop in paths) {
      let key = _.trimStart(prop, "/");
      if (!key) {
        continue;
      }
      const split = key.split("/");
      const wrapper = new PathItemWrapper();
      const pathItem = paths[prop];
      const tags = OpenServer.getTags(pathItem as OpenAPIV3.PathItemObject);
      let service = _.upperFirst(split[0].replace(/[^a-zA-Z0-9_]/g, "")) + "Service";
      /**
       * Use second tag as Service class name if it exists, otherwise use first part of the path splitted by back slash.
       */
      if (tags && tags.length > 1 && tags[1]) {
        service = _.upperFirst(tags[1].replace(/[^a-zA-Z0-9_]/g, "")) + "Service";
      }
      wrapper.service = service;
      let module = _.upperFirst(split[0])
      if (tags && tags.length) {
        module = _.upperFirst(tags[0])
      }
      wrapper.module = module;
      wrapper.endpoint = prop.replace(/{/g, "${params.");
      wrapper.pathItem = pathItem;
      const wrappers = pathItemWrapperMap.get(service) || [];
      wrappers.push(wrapper)
      pathItemWrapperMap.set(service, wrappers);
    }
    const services = [] as OpenService[];
    pathItemWrapperMap.forEach((wrappers: PathItemWrapper[], key: string) => {
      const service = new OpenService();
      service.name = key;
      service.module = wrappers[0].module;
      const routes = [] as OpenRoute[];
      for (let wrapper of wrappers) {
        const pathItem = wrapper.pathItem!;
        if (pathItem.parameters) {
          console.log("not support global parameters of path");
        }
        pathItem.get && routes.push(OpenRoute.of(wrapper.endpoint!, "get", pathItem.get as OpenAPI3Operation, document.components || {}))
        pathItem.post && routes.push(OpenRoute.of(wrapper.endpoint!, "post", pathItem.post as OpenAPI3Operation, document.components || {}))
        pathItem.put && routes.push(OpenRoute.of(wrapper.endpoint!, "put", pathItem.put as OpenAPI3Operation, document.components || {}))
        pathItem.delete && routes.push(OpenRoute.of(wrapper.endpoint!, "delete", pathItem.delete as OpenAPI3Operation, document.components || {}))
      }
      service.routes = routes;

      let types = routes.filter(route => route.reqBody != null
        && route.reqBody.type !== OpenTypeConstants.ANY
        && route.reqBody.type !== OpenTypeConstants.FORMDATA
        && route.reqBody.type !== OpenTypeConstants.BLOB
      ).map(route => {
        let type = route.reqBody!.type || '';
        const index = type.indexOf("[]");
        if (index >= 0) {
          type = type.substring(0, index);
        }
        if (!_.includes(OpenTypeConstants.values(), type)) {
          return type;
        }
        return '';
      });

      const collect = routes.filter(route => route.respData != null
        && route.respData.type !== OpenTypeConstants.ANY
        && route.respData.type !== OpenTypeConstants.BLOB
      )
        .map(route => {
          let type = route.respData.type || '';
          const index = type.indexOf("[]");
          if (index >= 0) {
            type = type.substring(0, index);
          }
          if (!_.includes(OpenTypeConstants.values(), type)) {
            return type;
          }
          return '';
        });
      types.push(...collect);
      service.types = [...new Set(types)].filter(type => type && !type.startsWith("{"))
      services.push(service)
    })
    openServer.services = services;
    return openServer;
  }
}

