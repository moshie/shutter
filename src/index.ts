import {environmentsInterface} from './environments-interface'
import writeChunkToFile from './write-chunk-to-file'
import multiShot from './multi-shot'
import chunk from './chunk'

import * as path from 'path'
import * as Promise from 'bluebird'
import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)

// TBA
// compare copy master

const cwd = process.cwd();
const comparisonOne = path.join(cwd, 'develop');
const comparisonTwo = path.join(cwd, 'master');

function checkPathsAreDirectories(...paths: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        Promise.map(paths, (path: string) => {
            return fs.statAsync(path)
                .then((stat: any) => stat.isDirectory())
                .catch((error: any) => {
                    if (error.code == 'ENOENT') {
                        return false; // File / folder doesn't exist fall back to then validation
                    }
                    reject(error); // If an error occured we reject
                });
        })
        .then((validation: boolean[]) => {
            let failureIndex: number = validation.indexOf(false);
            if (failureIndex !== -1) {
                reject(`${paths[failureIndex]} is not a directory`)
            } else {
                resolve(paths)
            }
        })
    })
}

// Check [cwd, 1 compare, 2 compare] are directories
checkPathsAreDirectories(cwd, comparisonOne, comparisonTwo)
    .then((paths: string) => {
        // Map through files in 1 compare
        // Check it exists in 2 compare
        // Compare image 1 and 2
        console.log(paths);
    })
    .catch((error) => {
        console.log(error);
    });













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
//     let filename: string = `chunk-${index}.json`;
//     return writeChunkToFile(filename, JSON.stringify(chunk))
//         .then((chunkFilename: string) => multiShot(environments, chunkFilename))
//         .then((chunkFilename: string) => fs.unlinkAsync(chunkFilename))
// }, {concurrency: 6})
//     .catch((error: any) => {
//         console.log(error)
//     })
