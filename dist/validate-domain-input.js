"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bag_1 = require("./bag");
var check_shorthand_url_1 = require("./check-shorthand-url");
function hasDomains(domains) {
    if (domains === void 0) { domains = []; }
    return domains.length == 0 ? false : true;
}
function domainIsInvalid(domain) {
    if (domain === void 0) { domain = ''; }
    return domain.indexOf('=') === -1;
}
function isEnvironmentProvided(domain) {
    if (domain === void 0) { domain = ''; }
    var _a = domain.split('='), environment = _a[0], url = _a[1];
    return !environment.length || !domain.length;
}
function environmentHasSymbols(domain) {
    if (domain === void 0) { domain = ''; }
    var _a = domain.split('='), environment = _a[0], url = _a[1];
    var symbolsRegex = /[!-/ :-@ \[-` {-~]/g;
    return symbolsRegex.test(environment);
}
function domainHasPathname(domain) {
    if (domain === void 0) { domain = ''; }
    var url = check_shorthand_url_1.default(domain);
    return url.pathname !== null && url.pathname !== '/';
}
function validateDomainInput(domains) {
    if (domains === void 0) { domains = []; }
    var bag = new bag_1.default('Validation Error');
    if (!hasDomains()) {
        bag.add('Please specify environments to screenshot e.g. master=http://www.google.com');
        return bag;
    }
    for (var i = domains.length - 1; i >= 0; i--) {
        var domain_1 = domains[i];
        if (domainIsInvalid(domain_1)) {
            bag.add("Please specify the domain for " + domains[i] + " e.g. master=http://www.google.com");
            continue;
        }
        if (isEnvironmentProvided(domain_1)) {
            bag.add("Invalid Environment provided \"" + domain_1 + "\"");
        }
        if (environmentHasSymbols(domain_1)) {
            bag.add("Environment cannot contain symbols! \"" + domain_1 + "\"");
        }
        if (domainHasPathname(domain_1)) {
            bag.add("Pathnames not supported in " + domain_1);
        }
    }
    return bag;
}
exports.default = validateDomainInput;
//# sourceMappingURL=validate-domain-input.js.map