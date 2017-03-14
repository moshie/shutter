"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
var cwd = process.cwd();
var comparisonOne = path.join(cwd, 'develop');
var comparisonTwo = path.join(cwd, 'master');
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
checkPathsAreDirectories(cwd, comparisonOne, comparisonTwo)
    .then(function (paths) {
    console.log(paths);
})
    .catch(function (error) {
    console.log(error);
});
//# sourceMappingURL=index.js.map