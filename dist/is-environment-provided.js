"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domain_is_invalid_1 = require("./domain-is-invalid");
function isEnvironmentProvided(domain) {
    if (domain === void 0) { domain = ''; }
    if (domain_is_invalid_1.default(domain)) {
        return false;
    }
    var _a = domain.split('='), environment = _a[0], url = _a[1];
    return !environment.length || !url.length;
}
exports.default = isEnvironmentProvided;
//# sourceMappingURL=is-environment-provided.js.map