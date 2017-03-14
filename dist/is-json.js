"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isJson(json) {
    try {
        JSON.parse(json);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.default = isJson;
//# sourceMappingURL=is-json.js.map