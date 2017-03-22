"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URL = require("url");
var Promise = require("bluebird");
var Spider = require("node-spider");
var paths = [];
var visited = [];
function handleRequest(spider, doc, domain) {
    doc.$('a[href]').each(function (i, elem) {
        if (i == 1000000) {
            return false;
        }
        var href = doc.$(elem).attr('href');
        var relativeRegex = new RegExp('^(https?\:\/\/(www\.)?' + domain.host + ')|^(\/\w?.*)');
        var forwardSlash = new RegExp('^(\/)');
        var extension = new RegExp('(\.\w+)$');
        if (!relativeRegex.test(href) || paths.indexOf(href) !== -1 || extension.test(href)) {
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
        if (visited.indexOf(next) == -1) {
            visited.push(next);
            spider.queue(next, function (doc) { return handleRequest(spider, doc, domain); });
        }
    });
}
function crawl(environments) {
    var url = environments[Object.keys(environments)[0]];
    var domain = URL.parse(url);
    return new Promise(function (resolve, reject) {
        var spider = new Spider({
            concurrent: 5,
            error: function (error, url) { return reject(error); },
            done: function () { return resolve(paths); },
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
            },
        });
        spider.queue(URL.format(domain), function (doc) { return handleRequest(spider, doc, domain); });
    });
}
exports.default = crawl;
//# sourceMappingURL=crawl.js.map