#!/usr/bin/env node


import * as chalk from 'chalk'
import * as path from 'path'
import * as Promise from 'bluebird'
import * as program from 'commander'
import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)

import chunk from './chunk'
import crawl from './crawl'
import validator from './validator'
import multiShot from './multi-shot'
import folderComparison from './folder-comparison'
import writeChunkToFile from './write-chunk-to-file'
import sanitizeEnvironments from './sanitize-environments'
import makeComparisonFolder from './make-comparison-folder'
import {environmentsInterface} from './environments-interface'
import checkPathsAreDirectories from './check-paths-are-directories'

const version = require('../package').version;


// `shutter screenshots master=https://google.com development=https://dev.google.com test=https://test.google.com —config=~/config.yaml`

program
    .version(version)
    .command('screenshots [domains...]')
    .description('take screenshots of specified domains')
    .arguments('-c, --config')
    .action(function (domains: string[]) {

    	try {
			validator(domains)
		} catch (error) {
			console.log(`${chalk.red('Error')}: ${error.message}`);
		}

        const environments: environmentsInterface = sanitizeEnvironments(domains)


    	crawl(environments)
    		.then((paths: string[]) => chunk(paths, 6))
    		.map((chunk: string[], index: number): Promise<string> => {
            let filename: string = path.join(__dirname, `chunk-${index}.json`);
            return writeChunkToFile(filename, JSON.stringify(chunk))
                .then((chunkFilename: string) => multiShot(environments, chunkFilename))
                .then((chunkFilename: string) => fs.unlinkAsync(chunkFilename))
        }, {concurrency: 6})
            .catch((error: any) => {
                console.log(error)
            })
    })

    // `shutter compare master development` <— will compare “prescreenshoted” sites
    // `shutter compare https://google.com https://dev.google.com` <— will crawl site, take screenshots then compare them

    program
        .command('compare <original> <comparison>')
        .action(function (original, comparison) {
            // Check if urls or paths!!

            const cwd = process.cwd();
            const comparisonOne = path.join(cwd, original);
            const comparisonTwo = path.join(cwd, comparison);

            checkPathsAreDirectories(comparisonOne, comparisonTwo)
                .then(() => makeComparisonFolder(comparisonOne, comparisonTwo))
                .then(() => folderComparison(comparisonOne, comparisonTwo))
                .catch((error) => {
                    console.log(error);
                });
        })


program.parse(process.argv);