"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function domainIsInvalid(domain) {
    if (domain === void 0) { domain = ''; }
    return domain.indexOf('=') === -1;
}
exports.default = domainIsInvalid;
//# sourceMappingURL=domain-is-invalid.js.map