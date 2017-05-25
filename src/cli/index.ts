"use strict"

import * as Promise from 'bluebird'

import sanitize from './sanitizer'

import Compare from '../compare'
import isDirectory from '../utilities/is-directory'

import { Duplex } from 'stream'

import { optionsInterface, environmentsInterface } from '../screenshot/interfaces'

import Screenshot from '../screenshot'

/**
 * Handle CLI Screenshots
 * 
 * @param {string[]} rawEnvironments 
 * @param {optionsInterface} options
 */
export function handleScreenshots(rawEnvironments: string[], options: optionsInterface): Duplex {

    const environments: environmentsInterface = sanitize(rawEnvironments)

    const screenshot: Screenshot = new Screenshot(environments, options)

    return screenshot.capture();
}

/**
 * Handle CLI Comparison
 * 
 * @param {string} original 
 * @param {string} comparison 
 * @param {optionsInterface} options
 */
export function handleCompare(original: string, comparison: string, options: optionsInterface): any {

    const compare: Compare = new Compare(options)

    const screenshot = handleScreenshots([
        `original=${original}`,
        `comparison=${comparison}`
    ], options)

    screenshot.pipe(compare)

}