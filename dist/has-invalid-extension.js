"use strict";
var whiteList = [
    'html',
    'htm',
    'xhtml',
    'jhtml',
    'php',
    'php3',
    'php4',
    'phtml',
    'asp',
    'aspx',
    'axd',
    'asmx',
    'ashx',
    'rhtml',
    'shtml',
    'xml'
];
var extension = new RegExp('(?:\.([a-z]+))$');
function hasInvalidExtension(href) {
    var matches = extension.exec(href);
    return matches !== null && whiteList.indexOf(matches[1]) === -1;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hasInvalidExtension;
