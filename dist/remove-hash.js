"use strict";
var URL = require("url");
function removeHash(href) {
    var parsedUrl = URL.parse(href);
    parsedUrl.hash = undefined;
    return URL.format(parsedUrl);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = removeHash;
