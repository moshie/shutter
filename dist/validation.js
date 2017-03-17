"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domain_validator_1 = require("./domain-validator");
var validation_handler_1 = require("./validation-handler");
function screenShotsValidation(domains) {
    var bag = domain_validator_1.default(domains);
    if (validation_handler_1.default(bag)) {
        process.exit();
    }
    return;
}
exports.screenShotsValidation = screenShotsValidation;
//# sourceMappingURL=validation.js.map