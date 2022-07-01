"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const ServiceGenerator_1 = require("../generators/ServiceGenerator");
const data = require("./usersvc_openapi3.json");
// import * as data from './petstore3.json'
const OpenServer_1 = require("../models/OpenServer");
const TypesGenerator_1 = require("../generators/TypesGenerator");
const BizServiceGenerator_1 = require("../generators/BizServiceGenerator");
const bizServiceGenerator = new BizServiceGenerator_1.BizServiceGenerator();
bizServiceGenerator.outputDir = 'api';
fs.mkdir(bizServiceGenerator.outputDir, { recursive: true }, function (err) {
    if (err) {
        throw err;
    }
    bizServiceGenerator.generate();
});
const openServer = OpenServer_1.OpenServer.convert(data);
(_a = openServer.services) === null || _a === void 0 ? void 0 : _a.forEach(function (service) {
    const serviceGenerator = new ServiceGenerator_1.ServiceGenerator();
    serviceGenerator.outputDir = 'api';
    serviceGenerator.service = service;
    // console.log(JSON.stringify(serviceGenerator.service, null, 4))
    fs.mkdir(serviceGenerator.outputDir, { recursive: true }, function (err) {
        if (err) {
            throw err;
        }
        serviceGenerator.generate();
    });
});
const typesGenerator = new TypesGenerator_1.TypesGenerator();
typesGenerator.outputDir = 'api';
typesGenerator.types = openServer.types;
fs.mkdir(typesGenerator.outputDir, { recursive: true }, function (err) {
    if (err) {
        throw err;
    }
    typesGenerator.generate();
});
//# sourceMappingURL=index.js.map