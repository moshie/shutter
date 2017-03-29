"use strict";
var has_env_1 = require("./has-env");
var has_symbols_1 = require("./has-symbols");
function isInvalid(domain) {
    if (domain === void 0) { domain = ''; }
    var equalsMatches = domain.match(/(\=)/g);
    if (equalsMatches === null) {
        return true;
    }
    return domain.indexOf('=') === -1 || equalsMatches.length > 1 || has_symbols_1.default(domain) || has_env_1.default(domain);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isInvalid;
