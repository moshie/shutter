"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var symbolsRegex = /[!-/ :-@ \[-` {-~]/g;
function hasSymbols(domain) {
    if (domain === void 0) { domain = ''; }
    var _a = domain.split('='), environment = _a[0], url = _a[1];
    return symbolsRegex.test(environment);
}
exports.default = hasSymbols;
//# sourceMappingURL=has-symbols.js.map