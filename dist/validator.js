"use strict";
var is_empty_1 = require("./is-empty");
var is_invalid_1 = require("./is-invalid");
function validator(domains) {
    if (domains === void 0) { domains = []; }
    if (is_empty_1.default(domains)) {
        throw new Error('Please specify environments to screenshot (master=http://www.google.com)');
    }
    for (var i = domains.length - 1; i >= 0; i--) {
        var domain_1 = domains[i];
        if (is_invalid_1.default(domain_1)) {
            throw new Error("\"" + domain_1 + "\" is an invalid environment (master=http://www.google.com)");
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validator;
