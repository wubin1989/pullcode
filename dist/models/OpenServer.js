"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenServer = void 0;
const OpenService_1 = require("./OpenService");
const OpenType_1 = require("./OpenType");
const _ = require("lodash");
const OpenRoute_1 = require("./OpenRoute");
const OpenTypeConstants_1 = require("./OpenTypeConstants");
class PathItemWrapper {
}
class OpenServer {
    static getTags(pathItem) {
        if (pathItem.get) {
            return pathItem.get.tags || [];
        }
        if (pathItem.post) {
            return pathItem.post.tags || [];
        }
        if (pathItem.put) {
            return pathItem.put.tags || [];
        }
        if (pathItem.delete) {
            return pathItem.delete.tags || [];
        }
        return [];
    }
    static convert(document) {
        const openServer = new OpenServer();
        const servers = document.servers;
        if (servers && servers.length) {
            openServer.name = servers[0].url;
        }
        const types = [];
        const schemas = document.components && document.components.schemas;
        if (schemas) {
            for (let prop in schemas) {
                types.push(OpenType_1.OpenType.fromSchema({
                    schema: schemas[prop],
                    typeName: prop.replace(/[^a-zA-Z0-9_]/g, ""),
                }));
            }
        }
        openServer.types = types;
        const paths = document.paths;
        const pathItemWrapperMap = new Map();
        for (let prop in paths) {
            let key = _.trimStart(prop, "/");
            if (!key) {
                continue;
            }
            const split = key.split("/");
            const wrapper = new PathItemWrapper();
            const pathItem = paths[prop];
            const tags = OpenServer.getTags(pathItem);
            let service = _.upperFirst(split[0].replace(/[^a-zA-Z0-9_]/g, "")) + "Service";
            /**
             * Use second tag as Service class name if it exists, otherwise use first part of the path splitted by back slash.
             */
            if (tags && tags.length > 1 && tags[1]) {
                service = _.upperFirst(tags[1].replace(/[^a-zA-Z0-9_]/g, "")) + "Service";
            }
            wrapper.service = service;
            let module = _.upperFirst(split[0]);
            if (tags && tags.length) {
                module = _.upperFirst(tags[0]);
            }
            wrapper.module = module;
            wrapper.endpoint = prop.replace(/{/g, "${params.");
            wrapper.pathItem = pathItem;
            const wrappers = pathItemWrapperMap.get(service) || [];
            wrappers.push(wrapper);
            pathItemWrapperMap.set(service, wrappers);
        }
        const services = [];
        pathItemWrapperMap.forEach((wrappers, key) => {
            const service = new OpenService_1.OpenService();
            service.name = key;
            service.module = wrappers[0].module;
            const routes = [];
            for (let wrapper of wrappers) {
                const pathItem = wrapper.pathItem;
                if (pathItem.parameters) {
                    console.log("not support global parameters of path");
                }
                pathItem.get && routes.push(OpenRoute_1.OpenRoute.of(wrapper.endpoint, "get", pathItem.get, document.components || {}));
                pathItem.post && routes.push(OpenRoute_1.OpenRoute.of(wrapper.endpoint, "post", pathItem.post, document.components || {}));
                pathItem.put && routes.push(OpenRoute_1.OpenRoute.of(wrapper.endpoint, "put", pathItem.put, document.components || {}));
                pathItem.delete && routes.push(OpenRoute_1.OpenRoute.of(wrapper.endpoint, "delete", pathItem.delete, document.components || {}));
            }
            service.routes = routes;
            let types = routes.filter(route => route.reqBody != null
                && route.reqBody.type !== OpenTypeConstants_1.OpenTypeConstants.ANY
                && route.reqBody.type !== OpenTypeConstants_1.OpenTypeConstants.FORMDATA
                && route.reqBody.type !== OpenTypeConstants_1.OpenTypeConstants.BLOB).map(route => {
                let type = route.reqBody.type || '';
                const index = type.indexOf("[]");
                if (index >= 0) {
                    type = type.substring(0, index);
                }
                if (!_.includes(OpenTypeConstants_1.OpenTypeConstants.values(), type)) {
                    return type;
                }
                return '';
            });
            const collect = routes.filter(route => route.respData != null
                && route.respData.type !== OpenTypeConstants_1.OpenTypeConstants.ANY
                && route.respData.type !== OpenTypeConstants_1.OpenTypeConstants.BLOB)
                .map(route => {
                let type = route.respData.type || '';
                const index = type.indexOf("[]");
                if (index >= 0) {
                    type = type.substring(0, index);
                }
                if (!_.includes(OpenTypeConstants_1.OpenTypeConstants.values(), type)) {
                    return type;
                }
                return '';
            });
            types.push(...collect);
            service.types = [...new Set(types)].filter(type => type && !type.startsWith("{"));
            services.push(service);
        });
        openServer.services = services;
        return openServer;
    }
}
exports.OpenServer = OpenServer;
//# sourceMappingURL=OpenServer.js.map