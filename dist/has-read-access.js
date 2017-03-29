"use strict";
var fs = require("fs");
var Promise = require("bluebird");
var fsA = Promise.promisifyAll(fs);
function hasReadAccess(filepath) {
    return fsA.accessAsync(filepath, fs.constants.F_OK | fs.constants.R_OK)
        .then(function () { return filepath; })
        .catch(function (error) {
        return "No Read access to " + filepath;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hasReadAccess;
