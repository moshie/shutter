"use strict";
var check_paths_are_directories_1 = require("./check-paths-are-directories");
var make_comparison_folder_1 = require("./make-comparison-folder");
var folder_comparison_1 = require("./folder-comparison");
function compareDirectories(comparisonOne, comparisonTwo) {
    return check_paths_are_directories_1.default(comparisonOne, comparisonTwo)
        .then(function () { return make_comparison_folder_1.default(comparisonOne, comparisonTwo); })
        .then(function () { return folder_comparison_1.default(comparisonOne, comparisonTwo); });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = compareDirectories;
