"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleErrorBag(bag) {
    if (bag === void 0) { bag = []; }
    for (var i = bag.length - 1; i >= 0; i--) {
        var prefix = typeof bag[i].prefix === 'undefined' ? '' : bag[i].prefix + ": ";
        console.log("" + prefix + bag[i].message);
    }
    return bag;
}
exports.default = handleErrorBag;
//# sourceMappingURL=handle-error-bag.js.map