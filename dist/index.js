#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var path = require("path");
var Promise = require("bluebird");
var program = require("commander");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
var chunk_1 = require("./chunk");
var crawl_1 = require("./crawl");
var validator_1 = require("./validator");
var multi_shot_1 = require("./multi-shot");
var folder_comparison_1 = require("./folder-comparison");
var write_chunk_to_file_1 = require("./write-chunk-to-file");
var sanitize_environments_1 = require("./sanitize-environments");
var make_comparison_folder_1 = require("./make-comparison-folder");
var check_paths_are_directories_1 = require("./check-paths-are-directories");
var version = require('../package').version;
program
    .version(version)
    .command('screenshots [domains...]')
    .description('take screenshots of specified domains')
    .arguments('-c, --config')
    .action(function (domains) {
    try {
        validator_1.default(domains);
    }
    catch (error) {
        console.log(chalk.red('Error') + ": " + error.message);
    }
    var environments = sanitize_environments_1.default(domains);
    crawl_1.default(environments)
        .then(function (paths) { return chunk_1.default(paths, 6); })
        .map(function (chunk, index) {
        var filename = path.join(__dirname, "chunk-" + index + ".json");
        return write_chunk_to_file_1.default(filename, JSON.stringify(chunk))
            .then(function (chunkFilename) { return multi_shot_1.default(environments, chunkFilename); })
            .then(function (chunkFilename) { return fs.unlinkAsync(chunkFilename); });
    }, { concurrency: 6 })
        .then(function () {
        console.log(chalk.green('Success: ') + 'Screenshots complete!');
    })
        .catch(function (error) {
        console.log(error);
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