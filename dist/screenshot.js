"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var has_read_access_1 = require("./has-read-access");
var phantom_shell_1 = require("./phantom-shell");
function screenshot(chunkFilepath, domain, environment) {
    return has_read_access_1.default(chunkFilepath)
        .then(function (filepath) {
        return phantom_shell_1.default(filepath, domain, environment);
    })
        .catch(function (error) {
        console.log(error);
    });
}
exports.default = screenshot;
//# sourceMappingURL=screenshot.js.map