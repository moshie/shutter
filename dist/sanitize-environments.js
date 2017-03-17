"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var check_shorthand_url_1 = require("./check-shorthand-url");
var URL = require("url");
function sanitizeEnvironments(domains) {
    var environments = {};
    for (var i = domains.length - 1; i >= 0; i--) {
        var split = domains[i].split('=');
        var url = check_shorthand_url_1.default(split[1]);
        var urlString = URL.format(url);
        var base = urlString[urlString.length - 1] === '/' ? urlString : urlString + "/";
        environments[split[0]] = base;
    }
    return environments;
}
exports.default = sanitizeEnvironments;
//# sourceMappingURL=sanitize-environments.js.map