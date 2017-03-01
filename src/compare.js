const BlinkDiff = require('blink-diff');
const Promise = require('bluebird');
const logger = require('./logger');
const path = require('path');

function compare(originalPath, comparisonPath) {
    logger.info(originalPath, 'Comparing');
    let diff = new BlinkDiff({
        imageAPath: path.resolve(__dirname, '..', originalPath),
        imageBPath: path.resolve(__dirname, '..', comparisonPath),
        thresholdType: BlinkDiff.THRESHOLD_PERCENT,
        threshold: 0.01, // 1% threshold

        outputBackgroundBlue: 255,
        outputBackgroundGreen: 255,
        outputBackgroundRed: 255,
        outputBackgroundOpacity: 0.8,
        composition: false,
        outputMaskOpacity: 1,

        imageOutputPath: path.join(__dirname, '..', 'comparisons', path.basename(originalPath))
    });

    return new Promise((resolve, reject) => {
        diff.run((error, result) => {
           if (error) {
              reject(error);
              return;
           }
          console.log(diff.hasPassed(result.code) ? 'Passed' : 'Failed');
          console.log('Found ' + result.differences + ' differences.');
          resolve(result.code);
        });
    });
}

module.exports = compare;