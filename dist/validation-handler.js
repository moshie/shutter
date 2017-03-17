"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validationHandler(bag) {
    if (!bag.contents.length) {
        return false;
    }
    for (var i = bag.contents.length - 1; i >= 0; i--) {
        console.log("" + bag.contents[i].prefix + bag.contents[i].message);
    }
    return true;
}
exports.default = validationHandler;
//# sourceMappingURL=validation-handler.js.map