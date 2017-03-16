#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
var version = require('../package.json').version;
program
    .version(version)
    .command('screenshots [domains...] Pass in your ')
    .arguments('-c, --config')
    .action(function (domains) {
    console.log(domains);
    if (domains.length % 2 !== 0) {
        console.log('please specify ');
        process.exit(1);
    }
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map