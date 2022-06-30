import { BizServiceGenerator } from "../generators/BizServiceGenerator";
import * as fs from 'fs';
import { ServiceGenerator } from "../generators/ServiceGenerator";
import * as data from './usersvc_openapi3.json'
import { OpenServer } from "../models/OpenServer";
import { OpenAPIV3 } from "openapi-types";

// const bizServiceGenerator = new BizServiceGenerator()
// bizServiceGenerator.outputDir = 'api/ts/tmp'

// fs.mkdir(bizServiceGenerator.outputDir, { recursive: true }, function (err) {
//   if (err) {
//     throw err
//   }
//   bizServiceGenerator.generate();
// })

const openServer = OpenServer.convert(data as OpenAPIV3.Document)

openServer.services?.forEach(function (service) {
  const serviceGenerator = new ServiceGenerator()
  serviceGenerator.outputDir = 'api'
  serviceGenerator.service = service;
  // console.log(JSON.stringify(serviceGenerator.service, null, 4))
  fs.mkdir(serviceGenerator.outputDir, { recursive: true }, function (err) {
    if (err) {
      throw err
    }
    serviceGenerator.generate();
  })
})

