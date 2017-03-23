"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bag_1 = require("./bag");
var has_domains_1 = require("./has-domains");
var domain_is_invalid_1 = require("./domain-is-invalid");
var is_environment_provided_1 = require("./is-environment-provided");
var environment_has_symbols_1 = require("./environment-has-symbols");
function domainValidator(domains) {
    if (domains === void 0) { domains = []; }
    var bag = new bag_1.default('Validation Error');
    if (!has_domains_1.default(domains)) {
        bag.add('Please specify environments to screenshot e.g. master=http://www.google.com');
        return bag;
    }
    for (var i = domains.length - 1; i >= 0; i--) {
        var domain_1 = domains[i];
        if (domain_is_invalid_1.default(domain_1)) {
            bag.add("Please specify the domain for " + domains[i] + " e.g. master=http://www.google.com");
            continue;
        }
        if (is_environment_provided_1.default(domain_1)) {
            bag.add("Invalid Environment provided \"" + domain_1 + "\"");
        }
        if (environment_has_symbols_1.default(domain_1)) {
            bag.add("Environment cannot contain symbols! \"" + domain_1 + "\"");
        }
    }
    return bag;
}
exports.default = domainValidator;
//# sourceMappingURL=domain-validator.js.map