"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
var compare_1 = require("./compare");
function folderComparison(original, comparison) {
    return Promise.map(fs.readdirAsync(original), function (filename) {
        var originalResolved = path.resolve(original, filename);
        var comparisonResolved = path.resolve(comparison, filename);
        return fs.accessAsync(originalResolved, fs.constants.F_OK | fs.constants.R_OK)
            .then(function () { return fs.accessAsync(comparisonResolved, fs.constants.F_OK | fs.constants.R_OK); })
            .then(function () { return compare_1.default(originalResolved, comparisonResolved); });
    }, { concurrency: 6 });
}
exports.default = folderComparison;
//# sourceMappingURL=folder-comparison.js.map