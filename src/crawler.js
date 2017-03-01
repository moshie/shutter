const request = require('request');
const cheerio = require('cheerio');
const logger = require('./logger');
const URL = require('url');

function crawler(url, max) {

    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                console.log(error);
            }

            var paths = [];

            var $ = cheerio.load(body);
            $('a[href^="/"]').each(function() {
                paths.push($(this).prop('href'));
            });

            resolve(paths);
        });
    });

}

module.exports = crawler;