"use strict"

import * as Promise from 'bluebird'

import sanitize from './sanitizer'

import Compare from '../compare/compare'
import directoriesExistIn from '../utilities/directories-exist-in'

import { optionsInterface, environmentsInterface } from '../screenshot/interfaces'

import Screenshot from '../screenshot'

/**
 * Handle CLI Screenshots
 * 
 * @param {string[]} rawEnvironments 
 * @param {optionsInterface} options
 */
export function handleScreenshots(rawEnvironments: string[], options: optionsInterface): any {

    const environments: environmentsInterface = sanitize(rawEnvironments)

    const screenshot: Screenshot = new Screenshot(environments, options)

    return screenshot.capture()

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