"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sanitizePath(path) {
    path = path.replace(/^\/|\/$/g, '');
    path = path.replace(/\//g, '_');
    return !path ? 'home' : path;
}
exports.default = sanitizePath;
//# sourceMappingURL=sanitize-path.js.map