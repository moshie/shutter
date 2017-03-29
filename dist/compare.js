"use strict";
var path = require("path");
var Promise = require("bluebird");
var BlinkDiff = require("blink-diff");
function compare(original, comparison) {
    var originalFolderName = path.basename(path.dirname(original));
    var comparisonFolderName = path.basename(path.dirname(comparison));
    var diff = new BlinkDiff({
        imageAPath: original,
        imageBPath: comparison,
        thresholdType: BlinkDiff.THRESHOLD_PERCENT,
        threshold: 0.01,
        outputBackgroundBlue: 255,
        outputBackgroundGreen: 255,
        outputBackgroundRed: 255,
        outputBackgroundOpacity: 0.8,
        composition: false,
        outputMaskOpacity: 1,
        imageOutputPath: path.join(process.cwd(), originalFolderName + "_" + comparisonFolderName + "_comparisons", path.basename(original)) // Directory needs to exist
    });
    return new Promise(function (resolve, reject) {
        diff.run(function (error, result) {
            if (error) {
                reject(error);
                return;
            }
            resolve(result.code);
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = compare;
