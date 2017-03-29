"use strict";
function chunk(array, size) {
    var chunks = [];
    for (var i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = chunk;
