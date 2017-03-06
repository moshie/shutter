"use strict";
var write_chunk_to_file_1 = require("./write-chunk-to-file");
var multi_shot_1 = require("./multi-shot");
var chunk_1 = require("./chunk");
var Promise = require("bluebird");
var fileSystem = require("fs");
var fs = Promise.promisifyAll(fileSystem);
var environments = {
    'master': 'https://www.serentipi.co.uk',
    'develop': 'https://www.serentipi.co.uk',
    'test': 'https://www.serentipi.co.uk'
};
var paths = [
    '/',
    '/contact/',
    '/home',
    '/your-event/',
    '/weddings/',
    '/corporate/',
    '/private-functions/',
    '/our-story',
    '/gallery/',
    '/friends-venues/',
    '/open-days/',
    '/quote-me/'
];
var chunks = chunk_1.default(paths, 6);
Promise.map(chunks, function (chunk, index) {
    var filename = "chunk-" + index + ".json";
    write_chunk_to_file_1.default(filename, JSON.stringify(chunk))
        .then(function (chunkFilename) { return multi_shot_1.default(environments, chunkFilename); })
        .then(function (chunkFilename) { return fs.unlinkAsync(chunkFilename); });
}, { concurrency: 6 })
    .catch(function (errors) {
    console.log(errors);
});
//# sourceMappingURL=index.js.map