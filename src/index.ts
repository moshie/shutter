#!/usr/bin/env node

// Vendor
import * as fs from 'fs'
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
            .then((chunks: string[][]) => {
                console.log(`${chalk.magenta(`In Progress:`)} Capturing paths 🏞`)
                return chunks
            })
    		.map((chunk: string[], index: number): Promise<string> => {
	            return screenshotChunk(sanitizedEnvironments, chunk, index)
	        }, {concurrency: 6})
                .then(() => {
                    console.log(`${chalk.green(`Success:`)}  Paths captured successfully`)
                })
	            .catch((error: Error) => {
	                console.log(`${chalk.red('Error:')} ${error.message}`)
	            })
    })

    // `shutter compare master development` <— will compare “prescreenshoted” sites
    // `shutter compare https://google.com https://dev.google.com` <— will crawl site, take screenshots then compare them

    program
        .command('compare <original> <comparison>')
        .action(function (original, comparison) {

            // http://google.com http://dev.google.com
            // google.com dev.google.com
            // /master /develop

        	let cwd = process.cwd()
        	let comparisonOne = path.join(cwd, original)
            let comparisonTwo = path.join(cwd, comparison)

            // Check if is a path
            if (fs.existsSync(comparisonOne) && fs.existsSync(comparisonTwo)) {
              compareDirectories(comparisonOne, comparisonTwo)
                .then(() => {
                    console.log(`${chalk.green(`Success:`)} Sites compared successfully`)
                })
                .catch((error: string) => {
                    console.log(`${chalk.red('Error:')} ${error}`)
                    process.exit(1)
                })
                return
            }

            // Check if both contain /https?\:\/\// ITS A URL
            const domains: string[] = [`original=${original}`, `comparison=${comparison}`]

            try {
                validator(domains)
            } catch (error) {
                console.log(`${chalk.red('Error')}: ${error.message}`)
            }

            const environments: environmentsInterface = sanitizeEnvironments(domains)

            comparisonOne = path.join(cwd, 'original')
            comparisonTwo = path.join(cwd, 'comparison')

            // Assume url
            crawl(environments)
                .then((chunks: string[][]) => {
                    console.log(`${chalk.magenta(`In Progress:`)} Capturing paths 🏞`)
                    return chunks
                })
                .map((chunk: string[], index: number) => {
                    return screenshotChunk(environments, chunk, index)
                }, {concurrency: 6})
                .then(() => {
                    console.log(`${chalk.green(`Success:`)} Paths captured successfully`)
                })
                .then(() => compareDirectories(comparisonOne, comparisonTwo))
                .then(() => {
                    console.log(`${chalk.green(`Success:`)} Sites compared successfully 🏞  <=> 🏞`)
                })
                .catch((error: any) => {
                    if (typeof error === 'object') {
                        console.log(`${chalk.red('Error:')} ☠️ ${error.message}`)
                    }

                    console.log(`${chalk.red('Error:')} ☠️ ${error}`)
                })

        })


program.parse(process.argv)