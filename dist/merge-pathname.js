"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URL = require("url");
var firstForwardSlash = new RegExp('^(\/)');
function mergePathname(domain, href) {
    return URL.format(domain) + href.replace(firstForwardSlash, '');
}
exports.default = mergePathname;
//# sourceMappingURL=merge-pathname.js.map