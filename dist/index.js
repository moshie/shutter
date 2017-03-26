#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var chalk = require("chalk");
var program = require("commander");
var crawl_1 = require("./crawl");
var validator_1 = require("./validator");
var screenshot_chunk_1 = require("./screenshot-chunk");
var compare_directories_1 = require("./compare-directories");
var sanitize_environments_1 = require("./sanitize-environments");
var version = require('../package').version;
program
    .version(version)
    .command('screenshots [environments...]')
    .description('Render screenshots of web pages')
    .arguments('-c, --config')
    .action(function (environments) {
    try {
        validator_1.default(environments);
    }
    catch (error) {
        console.log("\n" + chalk.red('Error:') + " " + error.message + "\n");
        process.exit(1);
    }
    var sanitizedEnvironments = sanitize_environments_1.default(environments);
    crawl_1.default(sanitizedEnvironments)
        .map(function (chunk, index) {
        return screenshot_chunk_1.default(sanitizedEnvironments, chunk, index);
    }, { concurrency: 6 })
        .catch(function (error) {
        console.log(chalk.red('Error:') + " " + error.message);
    });
});
function isUrl(path) {
}
program
    .command('compare <original> <comparison>')
    .action(function (original, comparison) {
    var cwd = process.cwd();
    var comparisonOne = path.join(cwd, original);
    var comparisonTwo = path.join(cwd, comparison);
    if (isUrl(original) && isUrl(comparison)) {
        comparisonOne = path.join(cwd, 'original');
        comparisonTwo = path.join(cwd, 'comparison');
        var domains = ["original=" + original, "comparison=" + comparison];
        try {
            validator_1.default(domains);
        }
        catch (error) {
            console.log(chalk.red('Error') + ": " + error.message);
        }
        var environments_1 = sanitize_environments_1.default(domains);
        crawl_1.default(environments_1)
            .map(function (chunk, index) {
            return screenshot_chunk_1.default(environments_1, chunk, index);
        }, { concurrency: 6 })
            .then(function () { return compare_directories_1.default(comparisonOne, comparisonTwo); })
            .catch(function (error) {
            console.log(chalk.red('Error:') + " " + error);
        });
        return;
    }
    compare_directories_1.default(comparisonOne, comparisonTwo)
        .catch(function (error) {
        console.log(chalk.red('Error:') + " " + error);
        process.exit(1);
    });
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map