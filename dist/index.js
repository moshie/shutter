#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var path = require("path");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
var folder_comparison_1 = require("./folder-comparison");
var validation_1 = require("./validation");
var sanitize_environments_1 = require("./sanitize-environments");
var make_comparison_folder_1 = require("./make-comparison-folder");
var check_paths_are_directories_1 = require("./check-paths-are-directories");
var version = require('../package').version;
var URL = require("url");
var Spider = require("node-spider");
function crawl(environments) {
    for (var environment in environments)
        break;
    var paths = [];
    var domain = URL.parse(environments[environment]);
    return new Promise(function (resolve, reject) {
        var spider = new Spider({
            concurrent: 5,
            done: function () {
                resolve(paths);
            }
        });
        spider.queue(URL.format(domain), function handleRequest(doc) {
            doc.$("a[href]").each(function (i, elem) {
                var href = doc.$(elem).attr('href');
                if (paths.includes(href)) {
                    return true;
                }
                var relativeRegex = new RegExp('^(https?\:\/\/(www\.)?' + domain.host + ')|^(\/\w?.*)');
                if (relativeRegex.test(href)) {
                    if (/^(\/)/.test(href)) {
                        if (href[0] == '/') {
                            href = href.slice(1);
                        }
                        href = URL.format(domain) + href;
                    }
                    if (paths.includes(href)) {
                        return true;
                    }
                    paths.push(href);
                    spider.queue(href, handleRequest);
                }
            });
        });
    });
}
program
    .version(version)
    .command('screenshots [domains...]')
    .arguments('-c, --config')
    .action(function (domains) {
    validation_1.screenShotsValidation(domains);
    var environments = sanitize_environments_1.default(domains);
    crawl(environments)
        .then(function (paths) {
        var resolved = paths.map(function (v) {
            var pathname = URL.parse(v).pathname;
            if (pathname[0] == '/') {
                pathname = pathname.slice(1);
            }
            return pathname;
        });
        var final = resolved.filter(function (item, pos) { return resolved.indexOf(item) == pos; });
        console.log(final);
        process.exit();
    })
        .catch(function (error) {
        process.exit();
    });
});
program
    .command('compare <original> <comparison>')
    .action(function (original, comparison) {
    var cwd = process.cwd();
    var comparisonOne = path.join(cwd, original);
    var comparisonTwo = path.join(cwd, comparison);
    check_paths_are_directories_1.default(comparisonOne, comparisonTwo)
        .then(function () { return make_comparison_folder_1.default(comparisonOne, comparisonTwo); })
        .then(function () { return folder_comparison_1.default(comparisonOne, comparisonTwo); })
        .catch(function (error) {
        console.log(error);
    });
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map