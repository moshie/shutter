"use strict";
var check_shorthand_url_1 = require("./check-shorthand-url");
function sanitizeEnvironments(domains) {
    var environments = {};
    for (var i = domains.length - 1; i >= 0; i--) {
        var _a = domains[i].split('='), environment_1 = _a[0], url = _a[1];
        var urlString = check_shorthand_url_1.default(url);
        var base = urlString[urlString.length - 1] == '/' ? urlString : urlString + "/";
        environments[environment_1] = base;
    }
    return environments;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sanitizeEnvironments;
