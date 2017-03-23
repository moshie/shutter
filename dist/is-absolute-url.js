"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remove_www_1 = require("./remove-www");
function isAbsoluteUrl(domain, href) {
    if (typeof domain.host === 'undefined') {
        return false;
    }
    var absolute = new RegExp('^((https?:\/\/)?(www\.)?(' + remove_www_1.default(domain.host) + domain.pathname + '))');
    return absolute.test(href);
}
exports.default = isAbsoluteUrl;
//# sourceMappingURL=is-absolute-url.js.map