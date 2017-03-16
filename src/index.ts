#!/usr/bin/env node

import * as program from 'commander'
import {environmentsInterface} from './environments-interface'
import writeChunkToFile from './write-chunk-to-file'
import multiShot from './multi-shot'
import chunk from './chunk'
import checkPathsAreDirectories from './check-paths-are-directories'
import folderComparison from './folder-comparison'
import makeComparisonFolder from './make-comparison-folder'

import * as path from 'path'
import * as Promise from 'bluebird'
import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)
const version = require('../package.json').version;

// `shutter screenshots master=https://google.com development=https://dev.google.com test=https://test.google.com —config=~/config.yaml` <- config for predefined paths & other stuff
// `shutter compare master development` <— will compare “prescreenshoted” sites
// `shutter compare https://google.com https://dev.google.com` <— will crawl site, take screenshots then compare them

program
    .version(version)
    .command('screenshots [domains...] Pass in your ')
    .arguments('-c, --config')
    .action(function (domains) {
        console.log(domains);
        // validate 

        if (domains.length % 2 !== 0) {
            console.log('please specify ')
            process.exit(1);
        }

        
    })


program.parse(process.argv);


// compare copy master

// CLI Validation must supply 2 paths to compare!

// const cwd = process.cwd();
// const comparisonOne = path.join(cwd, 'develop');
// const comparisonTwo = path.join(cwd, 'master');

// checkPathsAreDirectories(comparisonOne, comparisonTwo)
//     .then(() => makeComparisonFolder(comparisonOne, comparisonTwo))
//     .then(() => folderComparison(comparisonOne, comparisonTwo))
//     .catch((error) => {
//         console.log(error);
//     });



// screenshot master https://www.google.com/ copy https://dev.google.com/ test https://test.google.com/


// const environments: environmentsInterface = {
//     'master': 'https://www.serentipi.co.uk',
//     'develop': 'https://www.serentipi.co.uk',
//     'test': 'https://www.serentipi.co.uk'
// }

// // Crawl first domain get back list of paths

// const paths: string[] = [
//     '/',
//     '/contact/',
//     '/home',
//     '/your-event/',
//     '/weddings/',
//     '/corporate/',
//     '/private-functions/',
//     '/our-story',
//     '/gallery/',
//     '/friends-venues/',
//     '/open-days/',
//     '/quote-me/'
// ]

// // Chunk paths 

// const chunks: string[][] = chunk(paths, 6);

// // loop through each chunk add it to a file `chunk-{index}.json` then for each environment run screenshot:

// Promise.map(chunks, (chunk: string[], index: number): Promise<string> => {
//     let filename: string = path.join(__dirname, `chunk-${index}.json`);
//     return writeChunkToFile(filename, JSON.stringify(chunk))
//         .then((chunkFilename: string) => multiShot(environments, chunkFilename))
//         .then((chunkFilename: string) => fs.unlinkAsync(chunkFilename))
// }, {concurrency: 6})
//     .catch((error: any) => {
//         console.log(error)
//     })
