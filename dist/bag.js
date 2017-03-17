"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bag = (function () {
    function Bag(defaultPrefix) {
        if (defaultPrefix === void 0) { defaultPrefix = ''; }
        this.defaultPrefix = defaultPrefix;
        this.contents = [];
    }
    Bag.prototype.add = function (message, prefix) {
        if (prefix === void 0) { prefix = ''; }
        var defaultPrefix = !this.defaultPrefix.length ? '' : this.defaultPrefix + ": ";
        prefix = !prefix.length ? defaultPrefix : prefix + ": ";
        this.contents.push({ prefix: prefix, message: message });
    };
    return Bag;
}());
exports.default = Bag;
//# sourceMappingURL=bag.js.map