#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var path = require("path");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
var folder_comparison_1 = require("./folder-comparison");
var validation_1 = require("./validation");
var sanitize_environments_1 = require("./sanitize-environments");
var make_comparison_folder_1 = require("./make-comparison-folder");
var check_paths_are_directories_1 = require("./check-paths-are-directories");
var version = require('../package').version;
var crawl_1 = require("./crawl");
program
    .version(version)
    .command('screenshots [domains...]')
    .arguments('-c, --config')
    .action(function (domains) {
    validation_1.screenShotsValidation(domains);
    var environments = sanitize_environments_1.default(domains);
    crawl_1.default(environments)
        .then(function (paths) {
        console.log(paths);
    })
        .catch(function (err) {
        console.log(err);
    });
});
program
    .command('compare <original> <comparison>')
    .action(function (original, comparison) {
    var cwd = process.cwd();
    var comparisonOne = path.join(cwd, original);
    var comparisonTwo = path.join(cwd, comparison);
    check_paths_are_directories_1.default(comparisonOne, comparisonTwo)
        .then(function () { return make_comparison_folder_1.default(comparisonOne, comparisonTwo); })
        .then(function () { return folder_comparison_1.default(comparisonOne, comparisonTwo); })
        .catch(function (error) {
        console.log(error);
    });
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map