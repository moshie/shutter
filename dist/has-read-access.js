"use strict";
var fs = require("fs");
var Promise = require("bluebird");
var fsA = Promise.promisifyAll(fs);
function hasReadAccess(chunkFilepath) {
    return fsA.accessAsync(chunkFilepath, fs.constants.F_OK | fs.constants.R_OK)
        .then(function () { return chunkFilepath; })
        .catch(function (error) {
        return "No Read access to " + chunkFilepath;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hasReadAccess;
//# sourceMappingURL=has-read-access.js.map