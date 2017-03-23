"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function removeWWW(hostname) {
    return hostname.indexOf('www.') !== -1 ? hostname.slice(4) : hostname;
}
exports.default = removeWWW;
//# sourceMappingURL=remove-www.js.map