"use strict";
var URL = require("url");
function checkShorthandUrl(domain) {
    var url = URL.parse(domain);
    if (url.protocol === null) {
        url = URL.parse("http://" + domain);
    }
    return URL.format(url);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkShorthandUrl;
