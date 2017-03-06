"use strict";
var screenshot_1 = require("./screenshot");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
function multiShot(environments, chunkFilename) {
    var promises = [];
    Object.keys(environments).forEach(function (env) {
        promises.push(screenshot_1.default(chunkFilename, environments[env], env));
    });
    return Promise.join.apply(Promise, promises).then(function () { return chunkFilename; })
        .catch(function (errors) {
        console.log(errors);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = multiShot;
//# sourceMappingURL=multi-shot.js.map