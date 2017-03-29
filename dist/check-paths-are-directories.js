"use strict";
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
                    return false; // File / folder doesn't exist fall back to then validation
                }
                reject(error); // If an error occured we reject
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkPathsAreDirectories;
