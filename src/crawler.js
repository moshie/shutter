const request = require('request');
const cheerio = require('cheerio');
const logger = require('./logger');
const URL = require('url-parse');

function crawl() {
    if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
        logger.error('Reached max limit of number of pages to visit.');
        return;
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
        logger.
    })
}

module.exports = crawl;