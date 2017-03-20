#!/usr/bin/env node

import * as program from 'commander'
import {environmentsInterface} from './environments-interface'
import * as path from 'path'
import * as Promise from 'bluebird'
import * as fileSystem from 'fs'
const fs: any = Promise.promisifyAll(fileSystem)

import chunk from './chunk'
import multiShot from './multi-shot'
import folderComparison from './folder-comparison'
import {screenShotsValidation} from './validation'
import writeChunkToFile from './write-chunk-to-file'
import sanitizeEnvironments from './sanitize-environments'
import makeComparisonFolder from './make-comparison-folder'
import checkPathsAreDirectories from './check-paths-are-directories'
const version = require('../package').version;


import * as URL from 'url'
import * as Spider from 'node-spider'



function crawl(environments: environmentsInterface): Promise<string[]> {

	for (var environment in environments) break;

	const paths: string[] = []

	const domain = URL.parse(environments[environment])

	return new Promise((resolve, reject) => {
		
		const spider = new Spider({
			concurrent: 5,
			done: function () {
				resolve(paths)
			}
		});
		spider.queue(URL.format(domain), function handleRequest(doc: any) {

			doc.$(`a[href]`).each(function (i: number, elem: any) {
				let href = doc.$(elem).attr('href')
				if (paths.includes(href)) {
					return true;
				}

				var relativeRegex = new RegExp('^(https?\:\/\/(www\.)?' + domain.host + ')|^(\/\w?.*)')

				if (relativeRegex.test(href)) {
					if (/^(\/)/.test(href)) {
						if (href[0] == '/') {
							href = href.slice(1)
						}
						href = URL.format(domain) + href;
					}
					if (paths.includes(href)) {
						return true;
					}
					paths.push(href)
					spider.queue(href, handleRequest)
				}
			})
		})
	})
	

}

// `shutter screenshots master=https://google.com development=https://dev.google.com test=https://test.google.com —config=~/config.yaml`

program
    .version(version)
    .command('screenshots [domains...]')
    .arguments('-c, --config')
    .action(function (domains: string[]) {
        screenShotsValidation(domains)
        const environments: environmentsInterface = sanitizeEnvironments(domains)

    	// Ideal setup below
    	// crawl(environments)
    	// 	.then((paths: string[]) => chunk(paths, 6))
    	// 	.map()


        crawl(environments)
        	// try and make it return the final paths so all I need to do is chunk the paths
        	.then((paths: string[]) => {
        		// remove the domain from the url
        		// This would be better if it was done at the retreval stage
				var resolved = paths.map((v) => {
					var pathname = URL.parse(v).pathname
					if (pathname[0] == '/') {
						pathname = pathname.slice(1)
					}
					return pathname
				})
				// Remove duplicates
				var final = resolved.filter((item, pos) => resolved.indexOf(item) == pos)
				console.log(final);
    			process.exit()
        	})
        	.catch((error: any) => {
    			//console.log(error);
    			process.exit()
        	})

        // const paths: string[] = [
        //     '',
        //     'contact-us',
        //     'why-choose-us',
        //     'why-choose-us/faqs',
        //     'product-category/printing',
        //     'product-category/litho-and-digital-printing',
        //     'product-category/printing/large-format-printing',
        //     'product-category/printing/business-stationery',
        //     'product-category/printing/brochure-printing-services',
        //     'product-category/printing/print-processes',
        //     'product-category/print-sizes',
        //     'product-category/promotional-products',
        //     'branded-pens',
        //     'artwork',
        //     'office-furniture',
        //     'signs-displays',
        //     'exhibition-stand-ideas',
        //     'exhibition-stands',
        //     'exhibitions',
        //     'exhibitions/pop-up-banners'
        // ]

        //console.log(domains);
        // process.exit();

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