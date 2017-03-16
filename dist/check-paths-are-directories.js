"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
function checkPathsAreDirectories() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        Promise.map(paths, function (path) {
            return fs.statAsync(path)
                .then(function (stat) { return stat.isDirectory(); })
                .catch(function (error) {
                if (error.code == 'ENOENT') {
                    return false;
                }
                reject(error);
            });
        })
            .then(function (validation) {
            var failureIndex = validation.indexOf(false);
            if (failureIndex !== -1) {
                reject(paths[failureIndex] + " is not a directory");
            }
            else {
                resolve(paths);
            }
        });
    });
}
exports.default = checkPathsAreDirectories;
//# sourceMappingURL=check-paths-are-directories.js.map