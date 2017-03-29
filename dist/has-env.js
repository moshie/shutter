"use strict";
function hasEnv(domain) {
    if (domain === void 0) { domain = ''; }
    var _a = domain.split('='), environment = _a[0], url = _a[1];
    return !environment.length || !url.length;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hasEnv;
