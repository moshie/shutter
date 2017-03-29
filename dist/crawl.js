"use strict";
// Vendor
var URL = require("url");
var chalk = require("chalk");
var Promise = require("bluebird");
var Spider = require("node-spider");
// Internal
var chunk_1 = require("./chunk");
var remove_hash_1 = require("./remove-hash");
var valid_protocol_1 = require("./valid-protocol");
var merge_pathname_1 = require("./merge-pathname");
var is_absolute_url_1 = require("./is-absolute-url");
var check_shorthand_url_1 = require("./check-shorthand-url");
var has_invalid_extension_1 = require("./has-invalid-extension");
var paths = [];
var checked = [];
function handleRequest(spider, doc, domain) {
    doc.$('a[href]').each(function (i, elem) {
        var href = doc.$(this).attr('href');
        href = remove_hash_1.default(href);
        if (!valid_protocol_1.default(href) || checked.indexOf(href) !== -1 || has_invalid_extension_1.default(href)) {
            return true;
        }
        checked.push(href);
        if (is_absolute_url_1.default(domain, href)) {
            // Absolute
            var url = check_shorthand_url_1.default(href);
            href = URL.parse(url).pathname;
            href = href.replace(/^(\/)/, '');
            var next = url;
        }
        else {
            if (/^(https?\:\/\/)/.test(href)) {
                return true;
            }
            // Relative
            href = href.replace(/^(\/)/, '');
            var next = merge_pathname_1.default(domain, href);
        }
        if (paths.indexOf(href) !== -1) {
            return true;
        }
        paths.push(href);
        spider.queue(next, function (doc) { return handleRequest(spider, doc, domain); });
    });
}
function crawl(environments) {
    var url = environments[Object.keys(environments)[0]];
    var domain = URL.parse(url);
    console.log(chalk.magenta('Info:') + " Collecting internal pages from " + chalk.bgBlack(url));
    return new Promise(function (resolve, reject) {
        var spider = new Spider({
            concurrent: 20,
            error: function (error, url) {
                console.log(chalk.red('Error:') + " " + error.message);
                reject(error);
            },
            done: function () {
                console.log(chalk.green('Success:') + " Internal pages collected");
                resolve(chunk_1.default(paths, 6));
            },
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
            }
        });
        spider.queue(URL.format(domain), function (doc) { return handleRequest(spider, doc, domain); });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = crawl;
