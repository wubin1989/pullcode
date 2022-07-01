#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fs = require("fs");
const path = require("path");
const commander_1 = require("commander");
const converter = require("swagger2openapi");
const ServiceGenerator_1 = require("./generators/ServiceGenerator");
const OpenServer_1 = require("./models/OpenServer");
const TypesGenerator_1 = require("./generators/TypesGenerator");
const BizServiceGenerator_1 = require("./generators/BizServiceGenerator");
require('dotenv').config();
const program = new commander_1.Command();
program.option('-o, --output <value>', 'code output path');
program.option('-u, --url <value>', 'swagger 2.0 or openapi 3.0 json api document download url');
program.parse(process.argv);
const options = program.opts();
if (options.output)
    console.log(options.output);
if (options.url)
    console.log(options.url);
let output = options.output;
if (!output) {
    output = path.join(process.cwd(), options.service);
}
else if (!path.isAbsolute(output)) {
    output = path.resolve(process.cwd(), output);
}
function genCode(document) {
    fs.mkdir(output, { recursive: true }, function (err) {
        if (err) {
            throw err;
        }
        const openServer = OpenServer_1.OpenServer.convert(document);
        const bizServiceGenerator = new BizServiceGenerator_1.BizServiceGenerator();
        bizServiceGenerator.outputDir = output;
        bizServiceGenerator.generate();
        const typesGenerator = new TypesGenerator_1.TypesGenerator();
        typesGenerator.outputDir = output;
        typesGenerator.types = openServer.types;
        typesGenerator.generate();
        openServer.services && openServer.services.forEach(function (service) {
            const serviceGenerator = new ServiceGenerator_1.ServiceGenerator();
            serviceGenerator.outputDir = output;
            serviceGenerator.service = service;
            serviceGenerator.generate();
        });
    });
}
if (options.url) {
    const parsedUrl = new URL(options.url);
    const reqUrl = parsedUrl.origin + parsedUrl.pathname + parsedUrl.search;
    const username = parsedUrl.username;
    const password = parsedUrl.password;
    const option = {};
    if (username !== '' || password !== '') {
        option.auth = {
            username,
            password
        };
    }
    (0, axios_1.default)(reqUrl, option).then(function (res) {
        return res.data;
    }).then(function (obj) {
        if (obj.swagger) {
            let _options = {};
            _options.origin = true;
            _options.source = options.url;
            _options.patch = true;
            _options.resolve = true;
            converter.convert(obj, _options, function (err, ret) {
                if (err) {
                    throw err;
                }
                genCode(ret.openapi);
            });
        }
        else {
            genCode(obj);
        }
    })
        .catch(function (err) {
        console.log(err);
    });
}
//# sourceMappingURL=index.js.map