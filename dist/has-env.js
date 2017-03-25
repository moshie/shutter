"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasEnv(domain) {
    if (domain === void 0) { domain = ''; }
    var _a = domain.split('='), environment = _a[0], url = _a[1];
    return !environment.length || !url.length;
}
exports.default = hasEnv;
//# sourceMappingURL=has-env.js.map