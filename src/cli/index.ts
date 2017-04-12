"use strict"

import * as Promise from 'bluebird'

import sanitize from './sanitizer'

import Compare from '../compare/compare'
import directoriesExistIn from '../utilities/directories-exist-in'

import { optionsInterface } from './options-interface'
import { environmentsInterface } from './environments-interface'





import Crawler from '../crawler/crawler'
import Collector from '../collector/collector'
import Files from '../files/files'
import Screenshot from '../screenshot/screenshot'

/**
 * Handle CLI Screenshots
 * 
 * @param {string[]} rawEnvironments 
 * @param {optionsInterface} options
 */
export function handleScreenshots(rawEnvironments: string[], options: optionsInterface): any {

    //TODO: This needs optimizing too much blocking code seperate each validation check out to its own async
    const environments: environmentsInterface = sanitize(rawEnvironments)

    const crawler: Crawler = new Crawler(environments[Object.keys(environments)[0]])
    const collector: Collector = new Collector(10)
    const file: Files = new Files(options.directory)
    const capture: Screenshot = new Screenshot(environments) // TODO: Convert to duplex stream 4 Comparison

    return crawler.pipe(collector).pipe(file).pipe(capture)

}

/**
 * Handle CLI Comparison
 * 
 * @param {string} original 
 * @param {string} comparison 
 * @param {optionsInterface} options
 */
export function handleCompare(original: string, comparison: string, options: optionsInterface): Promise<any> {

    // TODO: Make Comparison work with streams <3
    if (directoriesExistIn(options.directory || process.cwd(), original, comparison)) {
        return (new Compare(original, comparison, options.directory)).run()
    }

    let environments: string[] = [`original=${original}`, `comparison=${comparison}`]

    return handleScreenshots(environments, options).pipe(/* compare */)

}