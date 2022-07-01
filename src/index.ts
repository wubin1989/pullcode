#!/usr/bin/env node

import axios, { AxiosRequestConfig } from "axios";
import * as fs from "fs";
import * as path from "path"
import { Command } from 'commander';
import * as converter from 'swagger2openapi';
import { OpenAPIV2, OpenAPIV3 } from "openapi-types";
import { ServiceGenerator } from "./generators/ServiceGenerator";
import { OpenServer } from "./models/OpenServer";
import { TypesGenerator } from "./generators/TypesGenerator";
import { BizServiceGenerator } from './generators/BizServiceGenerator';

require('dotenv').config();

const program = new Command();

program.option('-o, --output <value>', 'code output path')
program.option('-u, --url <value>', 'swagger 2.0 or openapi 3.0 json api document download url')

program.parse(process.argv);

const options = program.opts();
if (options.output) console.log(options.output);
if (options.url) console.log(options.url);

let output = options.output
if (!output) {
    output = path.join(process.cwd(), options.service)
} else if (!path.isAbsolute(output)) {
    output = path.resolve(process.cwd(), output)
}

function genCode(document: OpenAPIV3.Document) {
    fs.mkdir(output, { recursive: true }, function (err) {
        if (err) {
            throw err
        }
        const openServer = OpenServer.convert(document)
        const bizServiceGenerator = new BizServiceGenerator()
        bizServiceGenerator.outputDir = output
        bizServiceGenerator.generate();

        const typesGenerator = new TypesGenerator()
        typesGenerator.outputDir = output
        typesGenerator.types = openServer.types;
        typesGenerator.generate();

        openServer.services && openServer.services.forEach(function (service) {
            const serviceGenerator = new ServiceGenerator()
            serviceGenerator.outputDir = output
            serviceGenerator.service = service;
            serviceGenerator.generate();
        })
    })
}

if (options.url) {
    const parsedUrl = new URL(options.url)
    const reqUrl = parsedUrl.origin + parsedUrl.pathname + parsedUrl.search
    const username = parsedUrl.username
    const password = parsedUrl.password
    const option: AxiosRequestConfig = {}
    if (username !== '' || password !== '') {
        option.auth = {
            username,
            password
        }
    }
    axios(reqUrl, option).then(function (res) {
        return res.data
    }).then(function (obj: OpenAPIV2.Document | OpenAPIV3.Document) {
        if ((obj as OpenAPIV2.Document).swagger) {
            let _options = {} as any;
            _options.origin = true;
            _options.source = options.url;
            _options.patch = true;
            _options.resolve = true;
            converter.convert(obj, _options, function (err, ret) {
                if (err) {
                    throw err
                }
                genCode(ret.openapi)
            });
        } else {
            genCode(obj as OpenAPIV3.Document)
        }
    })
        .catch(function (err) {
            console.log(err)
        })
}
