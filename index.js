const Promise = require('bluebird');

const screenshot = require('./src/screenshot');
const compare = require('./src/compare');
const logger = require('./src/logger');

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

paths = paths.filter((path, index) => paths.indexOf(path) == index);

Promise.map(paths, (path) => {
    logger.success(path, 'Processing');
    return Promise.join(
            screenshot(original + path, 'original'),
            screenshot(comparison + path, 'comparison'),
            compare
        )
        .catch((error) => {
            logger.error(error, 'Error');
        });

}, {concurrency: 5})
    .then(() => {
        logger.success('All Done!');
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });
