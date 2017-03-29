#!/usr/bin/env node
"use strict";
var fs = require("fs");
var path = require("path");
var chalk = require("chalk");
var program = require("commander");
// Internal
var crawl_1 = require("./crawl");
var validator_1 = require("./validator");
var screenshot_chunk_1 = require("./screenshot-chunk");
var compare_directories_1 = require("./compare-directories");
var sanitize_environments_1 = require("./sanitize-environments");
// Misc
var version = require('../package').version;
program
    .version(version)
    .command('screenshots [environments...]')
    .description('Render screenshots of web pages')
    .arguments('-c, --config')
    .action(function (environments) {
    // Validation
    try {
        validator_1.default(environments);
    }
    catch (error) {
        console.log("\n" + chalk.red('Error:') + " " + error.message + "\n");
        process.exit(1);
    }
    // Sanitize
    var sanitizedEnvironments = sanitize_environments_1.default(environments);
    // Crawl -> Screenshot
    crawl_1.default(sanitizedEnvironments)
        .then(function (chunks) {
        console.log(chalk.magenta("In Progress:") + " Capturing paths \uD83C\uDFDE");
        return chunks;
    })
        .map(function (chunk, index) {
        return screenshot_chunk_1.default(sanitizedEnvironments, chunk, index);
    }, { concurrency: 6 })
        .then(function () {
        console.log(chalk.green("Success:") + "  Paths captured successfully");
    })
        .catch(function (error) {
        console.log(chalk.red('Error:') + " " + error.message);
    });
});
// `shutter compare master development` <— will compare “prescreenshoted” sites
// `shutter compare https://google.com https://dev.google.com` <— will crawl site, take screenshots then compare them
program
    .command('compare <original> <comparison>')
    .action(function (original, comparison) {
    // http://google.com http://dev.google.com
    // google.com dev.google.com
    // /master /develop
    var cwd = process.cwd();
    var comparisonOne = path.join(cwd, original);
    var comparisonTwo = path.join(cwd, comparison);
    // Check if is a path
    if (fs.existsSync(comparisonOne) && fs.existsSync(comparisonTwo)) {
        compare_directories_1.default(comparisonOne, comparisonTwo)
            .then(function () {
            console.log(chalk.green("Success:") + " Sites compared successfully");
        })
            .catch(function (error) {
            console.log(chalk.red('Error:') + " " + error);
            process.exit(1);
        });
        return;
    }
    // Check if both contain /https?\:\/\// ITS A URL
    var domains = ["original=" + original, "comparison=" + comparison];
    try {
        validator_1.default(domains);
    }
    catch (error) {
        console.log(chalk.red('Error') + ": " + error.message);
    }
    var environments = sanitize_environments_1.default(domains);
    comparisonOne = path.join(cwd, 'original');
    comparisonTwo = path.join(cwd, 'comparison');
    // Assume url
    crawl_1.default(environments)
        .then(function (chunks) {
        console.log(chalk.magenta("In Progress:") + " Capturing paths \uD83C\uDFDE");
        return chunks;
    })
        .map(function (chunk, index) {
        return screenshot_chunk_1.default(environments, chunk, index);
    }, { concurrency: 6 })
        .then(function () {
        console.log(chalk.green("Success:") + " Paths captured successfully");
    })
        .then(function () { return compare_directories_1.default(comparisonOne, comparisonTwo); })
        .then(function () {
        console.log(chalk.green("Success:") + " Sites compared successfully \uD83C\uDFDE  <=> \uD83C\uDFDE");
    })
        .catch(function (error) {
        if (typeof error === 'object') {
            console.log(chalk.red('Error:') + " \u2620\uFE0F " + error.message);
        }
        console.log(chalk.red('Error:') + " \u2620\uFE0F " + error);
    });
});
program.parse(process.argv);
