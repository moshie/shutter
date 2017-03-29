"use strict";
function isEmpty(domains) {
    if (domains === void 0) { domains = []; }
    return domains instanceof Array && domains.length === 0;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isEmpty;
