"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URL = require("url");
function removeHash(href) {
    var parsedUrl = URL.parse(href);
    parsedUrl.hash = undefined;
    return URL.format(parsedUrl);
}
exports.default = removeHash;
//# sourceMappingURL=remove-hash.js.map