"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var write_chunk_to_file_1 = require("./write-chunk-to-file");
var multi_shot_1 = require("./multi-shot");
var path = require("path");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
function screenshotChunk(environments, chunk, index) {
    var filename = path.join(__dirname, "chunk-" + index + ".json");
    return write_chunk_to_file_1.default(filename, JSON.stringify(chunk))
        .then(function (chunkFilename) { return multi_shot_1.default(environments, chunkFilename); })
        .then(function (chunkFilename) { return fs.unlinkAsync(chunkFilename); });
}
exports.default = screenshotChunk;
//# sourceMappingURL=screenshot-chunk.js.map