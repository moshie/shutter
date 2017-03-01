const shell = require("child_process").spawn;
const buildId = require('./buildId');
const Promise = require('bluebird');
const logger = require('./logger');
const path = require('path');
const phantomjs = path.resolve(__dirname, '..', 'node_modules', '.bin', 'phantomjs');

function isJson(json) {
    try {
        JSON.parse(json);
    } catch (e) {
        return false;
    }
    return true;
}

function screenshot(chunkPath, domain, env) {

    return new Promise((resolve, reject) => {
        const phantom = shell(phantomjs, ['phantom.js', chunkPath, domain, env]);

        var paths;

        phantom.stdout.on('data', (data) => {
            data = data.toString('utf8');

            if (isJson(data)) {
                paths = JSON.parse(data);
            } else {
                logger.success(data, 'Processing');
            }
        })

        phantom.stderr.on('data', (data) => {
            data = data.toString('utf8');
            logger.error(data);
            reject(data);
        });

        phantom.on('close', (code) => {
            resolve(paths);
        });

    });
}

module.exports = screenshot;