const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

Object.defineProperty(Array.prototype, 'chunk', {value: function(n) {
    return Array.from(Array(Math.ceil(this.length/n)), (_,i)=>this.slice(i*n,i*n+n));
}});

const screenshot = require('./src/screenshot');
const compareChunks = require('./src/compareChunks');
const logger = require('./src/logger');

const crawler = require('./src/crawler');

const original = 'http://gristwood.wpengine.com';
const comparison = 'http://gristwoodandtoms.co.uk';

var thing = crawler('http://gristwood.wpengine.com', 10)
    .then((paths) => {
        paths = paths.filter((path, index) => paths.indexOf(path) == index);
        return paths.chunk(5);
    })
    .then((chunks) => {
        Promise.map(chunks, (chunk, index) => {
            let chunkFile = `chunk-${index}.json`;
            return fs.writeFileAsync(chunkFile, JSON.stringify(chunk))
                .then((response) => {
                        return Promise.join(
                            screenshot(chunkFile, original, 'original'),
                            screenshot(chunkFile, comparison, 'comparison'),
                            compareChunks
                        )
                        .catch((error) => {
                            logger.error(error, 'Error');
                        });
                })
                .then(() => {
                    return fs.unlinkAsync(chunkFile);
                })
                .catch((error) => {
                    logger.error(error, 'Error');
                });

        }, {concurrency: 4})
            .then(() => {
                logger.success('All Done!');
            })
            .catch((error) => {
                logger.error(error);
            });
    })
    .catch((error) => {
        logger.error(error, 'Error');
    });