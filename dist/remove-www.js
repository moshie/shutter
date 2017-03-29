"use strict";
function removeWWW(hostname) {
    return hostname.indexOf('www.') !== -1 ? hostname.slice(4) : hostname;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = removeWWW;
