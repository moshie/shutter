"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URL = require("url");
function checkShorthandUrl(domain) {
    var url = URL.parse(domain);
    if (url.protocol === null) {
        url = URL.parse("http://" + domain);
    }
    return URL.format(url);
}
exports.default = checkShorthandUrl;
//# sourceMappingURL=check-shorthand-url.js.map