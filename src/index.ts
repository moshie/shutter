#!/usr/bin/env node

// Vendor
import * as path from 'path'
import * as chalk from 'chalk'
import * as Promise from 'bluebird'
import * as program from 'commander'

// Internal
import crawl from './crawl'
import validator from './validator'
import screenshotChunk from './screenshot-chunk'
import compareDirectories from './compare-directories'
import sanitizeEnvironments from './sanitize-environments'
import {environmentsInterface} from './environments-interface'

// Misc
const version = require('../package').version

program
    .version(version)
    .command('screenshots [environments...]')
    .description('Render screenshots of web pages')
    .arguments('-c, --config')
    .action(function (environments: string[]) {

    	// Validation
    	try {
			validator(environments)
		} catch (error) {
			console.log(`\n${chalk.red('Error:')} ${error.message}\n`)
			process.exit(1)
		}

		// Sanitize
        const sanitizedEnvironments: environmentsInterface = sanitizeEnvironments(environments)

        // Crawl -> Screenshot
    	crawl(sanitizedEnvironments)
    		.map((chunk: string[], index: number): Promise<string> => {
	            return screenshotChunk(sanitizedEnvironments, chunk, index)
	        }, {concurrency: 6})
	            .catch((error: Error) => {
	                console.log(`${chalk.red('Error:')} ${error.message}`)
	            })
    })

    // `shutter compare master development` <— will compare “prescreenshoted” sites
    // `shutter compare https://google.com https://dev.google.com` <— will crawl site, take screenshots then compare them



    function isUrl(path: string): boolean {
    	// TODO: make this work!
    }


    program
        .command('compare <original> <comparison>')
        .action(function (original, comparison) {

        	let cwd = process.cwd()
        	let comparisonOne = path.join(cwd, original)
            let comparisonTwo = path.join(cwd, comparison)

        	if (isUrl(original) && isUrl(comparison)) {

        		comparisonOne = path.join(cwd, 'original')
            	comparisonTwo = path.join(cwd, 'comparison')

        		var domains = [`original=${original}`, `comparison=${comparison}`]

        		try {
					validator(domains)
				} catch (error) {
					console.log(`${chalk.red('Error')}: ${error.message}`)
				}

				const environments: environmentsInterface = sanitizeEnvironments(domains)
        		
				crawl(environments)
		    		.map((chunk: string[], index: number) => {
		    			return screenshotChunk(environments, chunk, index)
		    		}, {concurrency: 6})
		    		.then(() => compareDirectories(comparisonOne, comparisonTwo))
		    		.catch((error: any) => {
		                console.log(`${chalk.red('Error:')} ${error}`)
		            })

	    		return
        	}

      		compareDirectories(comparisonOne, comparisonTwo)
                .catch((error: string) => {
                    console.log(`${chalk.red('Error:')} ${error}`)
                    process.exit(1)
                }) 		

        })


program.parse(process.argv)