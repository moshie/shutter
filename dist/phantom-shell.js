"use strict";
// Vendor
var child_process_1 = require("child_process");
var Promise = require("bluebird");
var path = require("path");
// Internal
var is_json_1 = require("./is-json");
var phantomCLIPath = [__dirname, '..', 'node_modules', '.bin', 'phantomjs'];
var phantomCLI = path.resolve.apply(path, phantomCLIPath);
function screenshot(chunkFilepath, domain, environment) {
    var screenshotScriptPath = path.resolve(__dirname, 'screenshot.phantomjs.js');
    return new Promise(function (resolve, reject) {
        var phantom = child_process_1.spawn(phantomCLI, [screenshotScriptPath, chunkFilepath, domain, environment]);
        var paths;
        phantom.stdout.on('data', function (data) {
            var out = data.toString('utf8');
            if (is_json_1.default(out)) {
                paths = JSON.parse(out);
            }
            else {
            }
        });
        phantom.stderr.on('data', function (data) {
            var message = data.toString('utf8');
            reject(message);
        });
        phantom.on('close', function (code) {
            resolve(paths);
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = screenshot;
