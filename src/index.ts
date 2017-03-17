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




import {screenShotsValidation} from './validation'
import sanitizeEnvironments from './sanitize-environments'

program
    .version(version)
    .command('screenshots [domains...]')
    .arguments('-c, --config')
    .action(function (domains: string[]) {
        screenShotsValidation(domains)
        const environments: environmentsInterface = sanitizeEnvironments(domains)

        const paths: string[] = [
            '',
            'contact-us',
            'why-choose-us',
            'why-choose-us/faqs',
            'product-category/printing',
            'product-category/litho-and-digital-printing',
            'product-category/printing/large-format-printing',
            'product-category/printing/business-stationery',
            'product-category/printing/brochure-printing-services',
            'product-category/printing/print-processes',
            'product-category/print-sizes',
            'product-category/promotional-products',
            'branded-pens',
            'artwork',
            'office-furniture',
            'signs-displays',
            'exhibition-stand-ideas',
            'exhibition-stands',
            'exhibitions',
            'exhibitions/pop-up-banners'
        ]

        // Chunk paths 

        const chunks: string[][] = chunk(paths, 6);

        // loop through each chunk add it to a file `chunk-{index}.json` then for each environment run screenshot:

        Promise.map(chunks, (chunk: string[], index: number): Promise<string> => {
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


// compare copy master

// CLI Validation must supply 2 paths to compare!








