"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domain_validator_1 = require("./domain-validator");
function domainValidation(domains) {
    try {
        domain_validator_1.default(domains);
    }
    catch (e) {
    }
    return;
}
exports.domainValidation = domainValidation;
//# sourceMappingURL=validation.js.map