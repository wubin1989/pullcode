"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const ServiceGenerator_1 = require("../generators/ServiceGenerator");
const data = __importStar(require("./usersvc_openapi3.json"));
// import * as data from './petstore3.json'
const OpenServer_1 = require("../models/OpenServer");
const TypesGenerator_1 = require("../generators/TypesGenerator");
const openServer = OpenServer_1.OpenServer.convert(data);
// const bizServiceGenerator = new BizServiceGenerator()
// bizServiceGenerator.outputDir = 'api'
// fs.mkdir(bizServiceGenerator.outputDir, { recursive: true }, function (err) {
//   if (err) {
//     throw err
//   }
//   bizServiceGenerator.generate();
// })
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
console.log(JSON.stringify(openServer.types, null, 4));
fs.mkdir(typesGenerator.outputDir, { recursive: true }, function (err) {
    if (err) {
        throw err;
    }
    typesGenerator.generate();
});
//# sourceMappingURL=index.js.map