#!/usr/bin/env node
import * as program from 'commander'

const version = require('../../package').version
import {handleScreenshots, handleCompare} from '../cli'

program.version(version)

/**
 * shutter screenshots master=http://example.com staging=http://staging.example.com
 */
program
    .command('screenshots [environments...]')
    .description('Capture screenshots of web pages')
    .option('-d, --directory <directory>')
    .option('-p --paths <paths>')
    .action(handleScreenshots)

/**
 * shutter compare http://example.com http://staging.example.com
 * shutter compare /pathname/master /pathname/staging
 */
program
    .command('compare <original> <comparison>')
    .description('Compare screenshots of web pages')
    .option('-d, --directory <directory>')
    .option('-p --paths <paths>')
    .action(handleCompare)

program.parse(process.argv)