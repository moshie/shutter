"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
function writeChunkToFile(filename, contents) {
    return fs.writeFileAsync(filename, contents)
        .then(function () { return filename; })
        .catch(function (error) {
        console.log(error);
    });
}
exports.default = writeChunkToFile;
//# sourceMappingURL=write-chunk-to-file.js.map