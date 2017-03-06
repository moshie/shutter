"use strict";
function sanitizePath(path) {
    path = path.replace(/^\/|\/$/g, '');
    path = path.replace(/\//g, '_');
    return !path ? 'home' : path;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sanitizePath;
//# sourceMappingURL=sanitize-path.js.map