import * as fs from 'fs';
import { ServiceGenerator } from "../generators/ServiceGenerator";
import * as data from './usersvc_openapi3.json'
// import * as data from './petstore3.json'
import { OpenServer } from "../models/OpenServer";
import { OpenAPIV3 } from "openapi-types";
import { TypesGenerator } from "../generators/TypesGenerator";
import { BizServiceGenerator } from '../generators/BizServiceGenerator';

const bizServiceGenerator = new BizServiceGenerator()
bizServiceGenerator.outputDir = 'api'

fs.mkdir(bizServiceGenerator.outputDir, { recursive: true }, function (err) {
  if (err) {
    throw err
  }
  bizServiceGenerator.generate();
})

const openServer = OpenServer.convert(data as unknown as OpenAPIV3.Document)

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

const typesGenerator = new TypesGenerator()
typesGenerator.outputDir = 'api'
typesGenerator.types = openServer.types;
fs.mkdir(typesGenerator.outputDir, { recursive: true }, function (err) {
  if (err) {
    throw err
  }
  typesGenerator.generate();
})