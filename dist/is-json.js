"use strict";
function isJson(json) {
    try {
        JSON.parse(json);
    }
    catch (e) {
        return false;
    }
    return true;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isJson;
//# sourceMappingURL=is-json.js.map