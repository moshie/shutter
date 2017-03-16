"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
function makeComparisonFolder(original, comparison) {
    var comparisonFolder = path.basename(original) + "_" + path.basename(comparison) + "_comparisons";
    var comparisonPath = path.join(process.cwd(), comparisonFolder);
    return new Promise(function (resolve, reject) {
        return fs.statAsync(comparisonPath, function (error, stat) {
            if (error && error.code !== 'ENOENT') {
                reject(error);
            }
            else if (error && error.code === 'ENOENT') {
                return fs.mkdir(comparisonPath, function (_error) {
                    if (_error) {
                        reject(error);
                    }
                    resolve(comparisonPath);
                });
            }
            else {
                resolve(comparisonPath);
            }
        });
    });
}
exports.default = makeComparisonFolder;
//# sourceMappingURL=make-comparison-folder.js.map