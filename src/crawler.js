const request = require('request');
const cheerio = require('cheerio');
const logger = require('./logger');
const URL = require('url');

var final = [];

var MAX_PAGES_TO_VISIT;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url;
var baseUrl;

function crawler(START_URL, max) {
    MAX_PAGES_TO_VISIT = max;
    url = URL.parse(START_URL);
    baseUrl = url.protocol + "//" + url.hostname;
    pagesToVisit.push(START_URL);
    console.log(crawl());
}

function crawl() {
    if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
        logger.error('Reached max limit of number of pages to visit.');
        return final;
    }
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        crawl();
    } else {
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    pagesVisited[url] = true;
    numPagesVisited++;

    logger.info(url, 'Visiting page');
    request(url, (error, response, body) => {
        logger.info(response.statusCode, 'Status Code');
        if (response.statusCode !== 200) {
            callback();
            return;
        }
        var $ = cheerio.load(body);
        collectInternalLinks($);
        callback(); // crawl()
    })
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        final.push($(this).attr('href'));
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
}

module.exports = crawler;