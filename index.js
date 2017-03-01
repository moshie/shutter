const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const _ = require('lodash');

const screenshot = require('./src/screenshot');
const compareChunks = require('./src/compareChunks');
const logger = require('./src/logger');

// const crawler = require('./src/crawler');

// var thing = crawler('http://gristwood.wpengine.com', 10);
// console.log(thing);

const original = 'http://gristwood.wpengine.com';
const comparison = 'http://gristwoodandtoms.co.uk';

var paths = [
    '',
    '/checkout/',
    '/cart/',
    '/tree-surgery/',
    '/pests-diseases/',
    '/about/',
    '/careers-2/',
    '/wood-chip-suppliers/',
    '/consultancy/',
    '/consultancy/client-function/'
];

paths = paths.filter((path, index) => paths.indexOf(path) == index); // Remove Dups

var chunks = _.chunk(paths, 6); // Chunk paths

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
}, {concurrency: 5})
    .then(() => {
        logger.success('All Done!');
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });