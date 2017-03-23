"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var URL = require("url");
var Promise = require("bluebird");
var Spider = require("node-spider");
var check_shorthand_url_1 = require("./check-shorthand-url");
var paths = [];
var visited = [];
function removeWWW(hostname) {
    return hostname.indexOf('www.') == 0 ? hostname.slice(4) : hostname;
}
function validProtocal(href) {
    var matches = href.match(/^(?:[a-z]+(?=\:))/);
    if (matches !== null && !/^(https?)/.test(matches[0])) {
        return false;
    }
    return true;
}
function removeHash(href) {
    var parsedUrl = URL.parse(href);
    parsedUrl.hash = undefined;
    return URL.format(parsedUrl);
}
function isUrlAbsolute(domain, href) {
    var absolute = new RegExp('^((https?:\/\/)?(www\.)?(' + removeWWW(domain.host) + domain.pathname + '))');
    return absolute.test(href);
}
function mergePathname(domain, href) {
    return URL.format(domain) + href.replace(/^(\/)/, '');
}
var checked = [];
function handleRequest(spider, doc, domain) {
    doc.$('a[href]').each(function (i, elem) {
        var href = doc.$(this).attr('href');
        href = removeHash(href);
        if (!validProtocal(href) || checked.indexOf(href) !== -1) {
            return true;
        }
        checked.push(href);
        if (isUrlAbsolute(domain, href)) {
            var url = check_shorthand_url_1.default(href);
            href = url.pathname;
            href = href.replace(/^(\/)/, '');
            var next = URL.format(url);
        }
        else {
            if (/^(https?\:\/\/)/.test(href)) {
                return true;
            }
            href = href.replace(/^(\/)/, '');
            var next = mergePathname(domain, href);
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