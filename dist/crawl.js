"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URL = require("url");
var Promise = require("bluebird");
var Spider = require("node-spider");
var paths = [];
function handleRequest(spider, doc, domain) {
    doc.$("a[href]").each(function (i, elem) {
        var href = doc.$(elem).attr('href');
        var relativeRegex = new RegExp('^(https?\:\/\/(www\.)?' + domain.host + ')|^(\/\w?.*)');
        var forwardSlash = new RegExp('^(\/)');
        if (!relativeRegex.test(href) && paths.indexOf(href) !== -1) {
            return true;
        }
        if (forwardSlash.test(href)) {
            href = href.slice(1);
            var next = URL.format(domain) + href.slice(1);
        }
        else {
            var next = href;
            href = URL.parse(href).pathname;
            href = typeof href == 'string' && href.length ? href.slice(1) : '';
        }
        if (paths.indexOf(href) !== -1) {
            return true;
        }
        paths.push(href);
        if (paths.length == 300) {
            return;
        }
        spider.queue(next, function (doc) { return handleRequest(spider, doc, domain); });
    });
}
function crawl(environments) {
    var url = environments[Object.keys(environments)[0]];
    var domain = URL.parse(url);
    return new Promise(function (resolve, reject) {
        var spider = new Spider({
            concurrent: 5,
            error: function (error, url) { return reject(error); },
            done: function () { return resolve(paths); }
        });
        spider.queue(URL.format(domain), function (doc) { return handleRequest(spider, doc, domain); });
    });
}
exports.default = crawl;
//# sourceMappingURL=crawl.js.map