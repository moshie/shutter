"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var is_empty_1 = require("./is-empty");
var is_invalid_1 = require("./is-invalid");
function domainValidator(domains) {
    if (domains === void 0) { domains = []; }
    if (is_empty_1.default(domains)) {
        throw new Error('Please specify environments to screenshot e.g. master=http://www.google.com');
        return;
    }
    for (var i = domains.length - 1; i >= 0; i--) {
        var domain_1 = domains[i];
        if (is_invalid_1.default(domain_1)) {
            throw new Error("\"" + domain_1 + "\" is an invalid domain (master=http://www.google.com)");
            break;
        }
    }
}
exports.default = domainValidator;
//# sourceMappingURL=domain-validator.js.map