"use strict";
var URL = require("url");
var firstForwardSlash = new RegExp('^(\/)');
function mergePathname(domain, href) {
    return URL.format(domain) + href.replace(firstForwardSlash, '');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mergePathname;
