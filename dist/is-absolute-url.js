"use strict";
var remove_www_1 = require("./remove-www");
function isAbsoluteUrl(domain, href) {
    if (typeof domain.host === 'undefined') {
        return false;
    }
    var absolute = new RegExp('^((https?:\/\/)?(www\.)?(' + remove_www_1.default(domain.host) + domain.pathname + '))');
    return absolute.test(href);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isAbsoluteUrl;
