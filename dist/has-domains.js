"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEmpty(domains) {
    if (domains === void 0) { domains = []; }
    return !domains instanceof Array && !domains.length !== 0;
}
exports.default = isEmpty;
//# sourceMappingURL=has-domains.js.map