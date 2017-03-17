#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var write_chunk_to_file_1 = require("./write-chunk-to-file");
var multi_shot_1 = require("./multi-shot");
var chunk_1 = require("./chunk");
var path = require("path");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
var version = require('../package.json').version;
var validation_1 = require("./validation");
var sanitize_environments_1 = require("./sanitize-environments");
program
    .version(version)
    .command('screenshots [domains...]')
    .arguments('-c, --config')
    .action(function (domains) {
    validation_1.screenShotsValidation(domains);
    var environments = sanitize_environments_1.default(domains);
    var paths = [
        '',
        'contact-us',
        'why-choose-us',
        'why-choose-us/faqs',
        'product-category/printing',
        'product-category/litho-and-digital-printing',
        'product-category/printing/large-format-printing',
        'product-category/printing/business-stationery',
        'product-category/printing/brochure-printing-services',
        'product-category/printing/print-processes',
        'product-category/print-sizes',
        'product-category/promotional-products',
        'branded-pens',
        'artwork',
        'office-furniture',
        'signs-displays',
        'exhibition-stand-ideas',
        'exhibition-stands',
        'exhibitions',
        'exhibitions/pop-up-banners'
    ];
    var chunks = chunk_1.default(paths, 6);
    Promise.map(chunks, function (chunk, index) {
        var filename = path.join(__dirname, "chunk-" + index + ".json");
        return write_chunk_to_file_1.default(filename, JSON.stringify(chunk))
            .then(function (chunkFilename) { return multi_shot_1.default(environments, chunkFilename); })
            .then(function (chunkFilename) { return fs.unlinkAsync(chunkFilename); });
    }, { concurrency: 6 })
        .catch(function (error) {
        console.log(error);
    });
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map