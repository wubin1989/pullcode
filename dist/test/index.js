"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
// import * as data from './usersvc_openapi3.json'
const data = require("./petstore3.json");
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
// openServer.services?.forEach(function (service) {
//   const serviceGenerator = new ServiceGenerator()
//   serviceGenerator.outputDir = 'api'
//   serviceGenerator.service = service;
//   // console.log(JSON.stringify(serviceGenerator.service, null, 4))
//   fs.mkdir(serviceGenerator.outputDir, { recursive: true }, function (err) {
//     if (err) {
//       throw err
//     }
//     serviceGenerator.generate();
//   })
// })
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