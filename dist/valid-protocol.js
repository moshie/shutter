"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protocolRegex = new RegExp('^(?:[a-z]+(?=\:))');
var whiteListProtocols = new RegExp('^(https?)');
function validProtocol(href) {
    var matches = href.match(protocolRegex);
    return !(matches !== null && !whiteListProtocols.test(matches[0]));
}
exports.default = validProtocol;
//# sourceMappingURL=valid-protocol.js.map