"use strict";
var path = require("path");
var chalk = require("chalk");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
var compare_1 = require("./compare");
function folderComparison(original, comparison) {
    console.log(chalk.magenta("Info:") + " Comparing " + chalk.gray(path.basename(original)) + " with " + chalk.gray(path.basename(comparison)));
    return Promise.map(fs.readdirAsync(original), function (filename) {
        var originalResolved = path.resolve(original, filename);
        var comparisonResolved = path.resolve(comparison, filename);
        return fs.accessAsync(originalResolved, fs.constants.F_OK | fs.constants.R_OK) // Check file exists in first comparison
            .then(function () { return fs.accessAsync(comparisonResolved, fs.constants.F_OK | fs.constants.R_OK); }) // Check file exists in second comparison
            .then(function () { return compare_1.default(originalResolved, comparisonResolved); });
    }, { concurrency: 6 });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = folderComparison;
