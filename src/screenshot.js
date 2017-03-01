const shell = require("child_process").execFile;
const buildId = require('./buildId');
const Promise = require('bluebird');
const logger = require('./logger');
const path = require('path');
const phantomjs = path.resolve(__dirname, '..', 'node_modules', '.bin', 'phantomjs');

function screenshot(url, env) {
    return new Promise((resolve, reject) => {
        var id = buildId(url);
        shell(phantomjs, ['phantom.js', url, env, id], (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            var json;
            try {
                json = JSON.parse(stdout);
            } catch (e) {
                return reject(e);
            }
            return resolve(json[0]);
        });
    });
}

module.exports = screenshot;